(function() {
    // === 🛡️ SECURITY SHIELD ===
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = function(e) {
        if (e.keyCode == 123) return false;
        if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0))) return false;
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
    };
    setInterval(() => { (function() { (function a() { try { (function b(i) { if (('' + (i / i)).length !== 1 || i % 20 === 0) { (function() {}).constructor('debugger')(); } else { debugger; } b(++i); })(0); } catch (e) { setTimeout(a, 5000); } })() })(); }, 5000);

    // === 🧠 CORE LOGIC ===
    let _0x1a = [];
    let _0x2b = 'All';
    let _0x3c = 'All';
    let _0x4d = 'All';
    let _0x5e = '';
    let _0x6f = 0;
    let _0x7a = Infinity;

    const _0x8b = ['All', 'Elite Trainer Box', 'Booster Box', 'Booster Bundle', 'Collection Boxes', 'Tins', 'Blisters', 'Booster Packs', 'Other'];
    
    // UPDATED: Removed "151", added new sets
    const _0x9c = ["Surging Sparks", "Phantasmal Flames", "Prismatic Evolutions", "Stellar Crown", "Shrouded Fable", "Twilight Masquerade", "Temporal Forces", "Paldean Fates", "Paradox Rift", "Obsidian Flames", "Paldea Evolved", "Scarlet & Violet", "Silver Tempest", "Lost Origin", "Astral Radiance", "Brilliant Stars", "Fusion Strike", "Celebrations", "Evolving Skies", "Chilling Reign", "Battle Styles", "Shining Fates", "Vivid Voltage", "Ascended Heroes", "Black & White", "Chaos Rising", "Mega Evolution", "Perfect Order", "Destined Rivals", "Pokémon World Championship", "Journey Together"];

    const _0x10a = [
        { m: [["phantasmal", "flames", "elite"]], s: "Phantasmal Flames - Elite Trainer Box", i: "images/etbph.png" },
        { m: [["shrouded", "fable", "elite"]], s: "Shrouded Fable - Elite Trainer Box", i: "images/etbfable.png" },
        { m: [["perfect", "order", "elite"]], s: "Perfect Order - Elite Trainer Box", i: "images/etbpo.png" }
    ];

    function _0x11b(_v) {
        if (!_v) return 0;
        let c = _v.replace(/[^\d.,]/g, '');
        if (c.includes('.') && c.includes(',')) c = c.replace(/\./g, '').replace(',', '.');
        else if (c.includes(',')) c = c.replace(',', '.');
        return parseFloat(c) || 0;
    }

    /**
     * UPDATED: Comprehensive Set Mapping Logic
     * Handles specific product-to-set overrides provided by user
     */
    function _0x12c(_n, _u) {
        const _nn = _n.toLowerCase();
        
        // 1. Black & White Mapping (including Black Bolt)
        if (_nn.includes("black bolt") || _nn.includes("white flare") || _nn.includes("unova")) return "Black & White";

        // 2. Destined Rivals Mapping
        if (_nn.includes("destined rivals")) return "Destined Rivals";

        // 3. Pokémon World Championship Mapping
        if (_nn.includes("world championship") || _nn.includes("world champions deck") || _nn.includes("fernando cifuentes") || _nn.includes("sakuya ota") || _nn.includes("jesse parker")) return "Pokémon World Championship";

        // 4. Journey Together Mapping
        if (_nn.includes("journey together")) return "Journey Together";

        // 5. Mega Evolution Mapping (including Kangaskhan)
        if (_nn.includes("mega evolution") || _nn.includes("mega heroes mini tin") || _nn.includes("mega lucario") || _nn.includes("mega latias") || _nn.includes("mega gardevoir") || _nn.includes("kangaskhan ex box")) return "Mega Evolution";

        // 6. Phantasmal Flames Overrides (Charizard Tins)
        if (_nn.includes("charizard") && _nn.includes("tin")) return "Phantasmal Flames";

        // 7. Other Sets Mapping (Iono, Bellibolt, Poke Ball, Slashing, Classic, Charizard Special, Cynthia, Pokémon Day)
        if (_nn.includes("iono") || _nn.includes("bellibolt") || _nn.includes("poke ball tin") || _nn.includes("slashing legends") || _nn.includes("trading card game classic") || _nn.includes("charizard ex special collection") || _nn.includes("cynthia's garchomp") || _nn.includes("pokémon day 2026") || _nn.includes("calyrex vmax") || _nn.includes("mega venusaur ex") || _nn.includes("battle deck")) return "Other Sets";

        // 8. General Set Matcher
        for (const _s of _0x9c) {
            if (_nn.includes(_s.toLowerCase())) return _s;
        }
        
        return _n.includes(" - ") ? _n.split(" - ")[0] : "Other Sets";
    }

    function _0x13d(_n, _u) {
        const _t = (_n + " " + _u).toLowerCase();
        const _cn = _n.toLowerCase();
        if (_t.includes("elite trainer") || _t.includes("etb") || _t.includes("elitetrainer")) return _0x8b[1];
        if ((_t.includes("booster box") || _t.includes("half booster box") || _t.includes("display")) && !_t.includes("bundle")) return _0x8b[2];
        if (_cn.includes("36") && _cn.includes("booster") && !_t.includes("bundle")) return _0x8b[2];
        if (_t.includes("booster bundle")) return _0x8b[3];
        if (_cn.includes("blister") || _cn.includes("tech") || _cn.includes("3-pack") || _cn.includes("checklane")) return _0x8b[6];
        if (_cn.includes("tin")) return _0x8b[5];
        if (["ultra", "premium", "collection", "ex box", "special", "upc"].some(k => _cn.includes(k))) return _0x8b[4];
        if (_t.includes("pack") || _t.includes("booster") || _t.includes("sleeved")) return _0x8b[7];
        if (_t.includes("binder") || _t.includes("poster") || (_t.includes("sleeve") && !_t.includes("sleeved")) || _t.includes("portfolio") || _t.includes("deck")) return _0x8b[8];
        return _0x8b[8];
    }

    function _