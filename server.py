"""
PokéStock Live — real-time bidding server (MVP)
================================================
FastAPI + WebSocket auction engine that pairs with index.html.

WHY THIS DESIGN
  • The SERVER owns the clock and the auction state — never the video, never the
    client. This is what makes the few-second Twitch delay harmless: every viewer's
    countdown and close time come from here.
  • Anti-snipe: a bid inside the final 5s pushes the close out by 10s, so the video
    lag can't cheat a late bidder.
  • One in-memory room for the MVP. State resets on restart. No auth yet — the client
    name is trusted. Both are fine for an invite-only test; see HARDENING notes below.

RUN
  pip install -r requirements.txt
  uvicorn server:app --host 0.0.0.0 --port 8000
  # then open  http://localhost:8000  (this server also serves index.html)

PROTOCOL  (matches the comments in index.html)
  client -> server : {action:"join"|"bid"|"chat"|"go_live"|"end"|"add_time", ...}
  server -> client : {type:"state", serverNow, room:{...}}  or  {type:"error", message}
"""

import asyncio
import time
import os
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse

app = FastAPI(title="PokéStock Live bidding server")

now_ms = lambda: int(time.time() * 1000)
round2 = lambda n: round(float(n) + 1e-9, 2)

ANTISNIPE_WINDOW_MS = 5_000   # a bid landing within this of the end ...
ANTISNIPE_EXTEND_MS = 10_000  # ... pushes the close out by this much


class Room:
    """A single live auction lot + its bid/chat history."""
    def __init__(self):
        self.reset()

    def reset(self):
        self.status = "setup"          # setup | live | ended
        self.seller_name = ""
        self.item = {"title": "", "img": "", "desc": ""}
        self.start_bid = 5.0
        self.current_bid = 0.0
        self.high_bidder = None
        self.ends_at = None            # epoch ms
        self.bids = []                 # newest first: {name, amount, t}
        self.chat = []                 # oldest first: {name, msg, t}

    def snapshot(self, viewers: int):
        return {
            "status": self.status,
            "sellerName": self.seller_name,
            "viewers": viewers,
            "item": self.item,
            "startBid": self.start_bid,
            "currentBid": self.current_bid,
            "highBidder": self.high_bidder,
            "endsAt": self.ends_at,
            "bids": self.bids,
            "chat": self.chat,
        }

    def min_next(self) -> float:
        # first bid may equal the start price; afterwards must strictly beat it
        return self.current_bid if self.high_bidder is None else round2(self.current_bid + 0.01)


class Hub:
    """Tracks connections and serializes all state changes behind one lock."""
    def __init__(self):
        self.room = Room()
        self.clients: dict[WebSocket, dict] = {}   # ws -> {name, role}
        self.lock = asyncio.Lock()

    async def register(self, ws: WebSocket):
        self.clients[ws] = {"name": "guest", "role": "buyer"}

    async def drop(self, ws: WebSocket):
        self.clients.pop(ws, None)

    async def broadcast(self):
        payload = {"type": "state", "serverNow": now_ms(),
                   "room": self.room.snapshot(len(self.clients))}
        dead = []
        for ws in list(self.clients.keys()):
            try:
                await ws.send_json(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            await self.drop(ws)

    # ---- actions -------------------------------------------------------
    async def handle(self, ws: WebSocket, msg: dict):
        action = msg.get("action")
        who = self.clients.get(ws, {"name": "guest", "role": "buyer"})

        async with self.lock:
            if action == "join":
                who["name"] = (str(msg.get("name") or "guest"))[:18]
                who["role"] = "seller" if msg.get("role") == "seller" else "buyer"

            elif action == "go_live":
                self.room.reset()
                item = msg.get("item") or {}
                self.room.item = {"title": str(item.get("title") or "Untitled lot")[:80],
                                  "img": str(item.get("img") or "")[:500],
                                  "desc": str(item.get("desc") or "")[:200]}
                self.room.seller_name = who["name"]
                self.room.start_bid = max(0.0, round2(msg.get("startBid", 1)))
                self.room.current_bid = self.room.start_bid
                duration = max(5, int(msg.get("duration", 60)))
                self.room.status = "live"
                self.room.ends_at = now_ms() + duration * 1000

            elif action == "bid":
                if self.room.status != "live":
                    return await self._error(ws, "Auction is not live.")
                amount = round2(msg.get("amount", 0))
                if amount < self.room.min_next():
                    return await self._error(ws, "Bid too low.")
                self.room.current_bid = amount
                self.room.high_bidder = who["name"]
                self.room.bids = ([{"name": who["name"], "amount": amount, "t": now_ms()}]
                                  + self.room.bids)[:40]
                # anti-snipe: late bid extends the close
                if self.room.ends_at - now_ms() < ANTISNIPE_WINDOW_MS:
                    self.room.ends_at = now_ms() + ANTISNIPE_EXTEND_MS

            elif action == "chat":
                text = str(msg.get("msg") or "").strip()[:200]
                if text:
                    self.room.chat = (self.room.chat
                                      + [{"name": who["name"], "msg": text, "t": now_ms()}])[-60:]

            elif action == "add_time":
                if self.room.status == "live":
                    self.room.ends_at += max(1, int(msg.get("seconds", 15))) * 1000

            elif action == "end":
                if self.room.status == "live":
                    self.room.status = "ended"
                    self.room.ends_at = now_ms()

        await self.broadcast()

    async def _error(self, ws: WebSocket, message: str):
        try:
            await ws.send_json({"type": "error", "message": message})
        except Exception:
            pass

    # ---- background timekeeper ----------------------------------------
    async def ticker(self):
        """Closes the lot the instant the server clock passes ends_at."""
        while True:
            await asyncio.sleep(0.4)
            changed = False
            async with self.lock:
                if self.room.status == "live" and self.room.ends_at and now_ms() >= self.room.ends_at:
                    self.room.status = "ended"
                    changed = True
            if changed:
                await self.broadcast()


hub = Hub()


@app.on_event("startup")
async def _startup():
    asyncio.create_task(hub.ticker())


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    await hub.register(ws)
    await hub.broadcast()          # send current state to the newcomer (and refresh viewer count)
    try:
        while True:
            data = await ws.receive_json()
            await hub.handle(ws, data)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        await hub.drop(ws)
        await hub.broadcast()


@app.get("/health")
async def health():
    return JSONResponse({"ok": True, "status": hub.room.status, "viewers": len(hub.clients)})


# Convenience: serve index.html from the same origin so Twitch's parent=localhost
# and the WebSocket (ws://localhost:8000/ws) line up with no extra setup.
@app.get("/")
async def index():
    path = Path(__file__).parent / "index.html"
    if path.exists():
        return HTMLResponse(path.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>PokéStock Live server is running.</h1>"
                        "<p>Put index.html next to server.py to serve the frontend here.</p>")


# ----------------------------------------------------------------------
# HARDENING (when you outgrow the MVP):
#   • Auth: issue signed tokens at login; bind the WS to a verified user instead
#     of trusting the client-sent name (today a name is spoofable).
#   • Persistence: move room/bids to Postgres/Redis so a restart or a second
#     server instance doesn't lose the auction (and so you can scale out).
#   • Multi-room: key state by room code; one Hub per room.
#   • Payments: on "ended", create a Stripe PaymentIntent for the winner
#     (auth at bid time / capture at win) via Stripe Connect to pay out the seller.
#   • Rate-limit bids/chat per connection to stop spam and bid-bots.
# ----------------------------------------------------------------------
