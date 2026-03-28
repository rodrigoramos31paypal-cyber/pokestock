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
     * UPDATED: Comprehensive Set Mapping
     * Handles specific product assignments for Phantasmal Flames, Perfect Order, etc.
     */
    function _0x12c(_n, _u) {
        const _nn = _n.toLowerCase();
        
        // 1. Portfólio / Special Collection Fallback to Other Sets
        if (_nn.includes("portfólio") || _nn.includes("portfolio")) return "Other Sets";

        // 2. Phantasmal Flames Mapping (including Charizard UPC)
        if (_nn.includes("phantasmal flames") || (_nn.includes("charizard") && (_nn.includes("ultra-premium") || _nn.includes("tin")))) return "Phantasmal Flames";

        // 3. Perfect Order Mapping
        if (_nn.includes("perfect order")) return "Perfect Order";

        // 4. Ascended Heroes Mapping
        if (_nn.includes("ascended heroes")) return "Ascended Heroes";

        // 5. Black & White Mapping (including Black Bolt, White Flare, Unova)
        if (_nn.includes("black bolt") || _nn.includes("white flare") || _nn.includes("unova")) return "Black & White";

        // 6. Destined Rivals Mapping
        if (_nn.includes("destined rivals")) return "Destined Rivals";

        // 7. World Championship Mapping
        if (_nn.includes("world championship") || _nn.includes("world champions deck") || _nn.includes("fernando cifuentes") || _nn.includes("sakuya ota") || _nn.includes("jesse parker")) return "Pokémon World Championship";

        // 8. Journey Together Mapping
        if (_nn.includes("journey together")) return "Journey Together";

        // 9. Mega Evolution Mapping (specific tins and boxes)
        if (_nn.includes("mega heroes mini tin") || _nn.includes("mega lucario") || _nn.includes("mega latias") || _nn.includes("mega gardevoir") || _nn.includes("kangaskhan ex box") || _nn.includes("mega evolution")) return "Mega Evolution";

        // 10. Other Sets Overrides
        if (_nn.includes("iono") || _nn.includes("bellibolt") || _nn.includes("poke ball tin") || _nn.includes("slashing legends") || _nn.includes("trading card game classic") || _nn.includes("charizard ex special collection") || _nn.includes("cynthia's garchomp") || _nn.includes("pokémon day 2026") || _nn.includes("calyrex vmax") || _nn.includes("mega venusaur ex") || _nn.includes("battle deck")) return "Other Sets";

        // 11. Expansion Matcher
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

    function _0x14e(_u) {
        try { return new URL(_u).hostname.replace(/^www\./, '').split('.')[0].toUpperCase(); } 
        catch { return "STORE"; }
    }

    function _0x15f(_on, _ou, _oi) {
        let _ts = (_on + " " + _ou).toLowerCase().replace(/[^a-z0-9]/g, ' ');
        for (const _it of _0x10a) {
            for (const _wg of _it.m) {
                if (_wg.every(_w => _ts.includes(_w))) return { name: _it.s, img: _it.i };
            }
        }
        return { name: _on, img: _oi };
    }

    window.updateDropdowns = function() {
        const sS = document.getElementById('storeFilter');
        const sT = document.getElementById('setFilter');
        const pS = _0x3c;
        const pT = _0x4d;
        const cM = _0x1a.filter(p => _0x2b === 'All' || p.category === _0x2b);
        const aS = [...new Set(cM.map(p => p.store))].sort();
        const aT = [...new Set(cM.map(p => p.set))].sort();
        sS.innerHTML = '<option value="All">All Stores</option>' + aS.map(s => `<option value="${s}" ${s === pS ? 'selected' : ''}>${s}</option>`).join('');
        sT.innerHTML = '<option value="All">All Sets</option>' + aT.map(s => `<option value="${s}" ${s === pT ? 'selected' : ''}>${s}</option>`).join('');
    };

    window.setCategory = function(cat) { _0x2b = cat; updateDropdowns(); renderFilters(); renderProducts(); };

    window.renderFilters = function() {
        const c = document.getElementById('filterContainer');
        c.innerHTML = _0x8b.map(cat => `<button onclick="setCategory('${cat}')" class="px-4 py-2 rounded-full text-sm font-medium transition border ${_0x2b === cat ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600'}">${cat}</button>`).join('');
    };

    window.renderProducts = function() {
        const g = document.getElementById('productGrid');
        const f = _0x1a.filter(p => {
            const mC = _0x2b === 'All' || p.category === _0x2b;
            const mS = _0x3c === 'All' || p.store === _0x3c;
            const mT = _0x4d === 'All' || p.set === _0x4d;
            const mP = p.price >= _0x6f && p.price <= _0x7a;
            const mH = p.name.toLowerCase().includes(_0x5e.toLowerCase()) || p.store.toLowerCase().includes(_0x5e.toLowerCase());
            return mC && mS && mT && mP && mH;
        });
        document.getElementById('productCount').textContent = `${f.length} products found`;
        if (f.length === 0) { g.innerHTML = `<div class="col-span-full py-20 text-center text-gray-500">No products match these filters.</div>`; return; }
        g.innerHTML = f.map(p => `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition">
                <div class="h-48 bg-white flex items-center justify-center p-2">
                    <img src="${p.img}" referrerpolicy="no-referrer" class="h-full w-full object-contain mix-blend-multiply" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                </div>
                <div class="p-4 flex flex-col flex-grow">
                    <div class="flex justify-between items-start mb-1"><span class="text-[10px] font-bold text-red-500 uppercase tracking-tighter">${p.store}</span><span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">${p.set}</span></div>
                    <h3 class="text-sm font-semibold mb-3 line-clamp-2">${p.name}</h3>
                    <div class="mt-auto flex justify-between items-center"><span class="text-lg font-bold">€${p.price.toFixed(2)}</span><a href="${p.url}" target="_blank" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">BUY NOW</a></div>
                </div>
            </div>
        `).join('');
    };

    async function fetchData() {
        try {
            const r = await fetch(`seen_products.json?t=${Date.now()}`);
            const d = await r.json();
            _0x1a = [];
            for (const k in d) {
                const p = d[k];
                if (p.in_stock) {
                    const cl = _0x15f(p.name, p.url, p.img);
                    _0x1a.push({ name: cl.name, img: cl.img, url: p.url, price: _0x11b(p.price), store: _0x14e(p.url), category: _0x13d(cl.name, p.url), set: _0x12c(cl.name, p.url) });
                }
            }
            updateDropdowns(); renderFilters(); renderProducts();
            document.getElementById('lastUpdated').textContent = `Sync: ${new Date().toLocaleTimeString()}`;
        } catch (e) { console.error("ERR_DATA_FETCH"); }
    }

    document.getElementById('searchInput').addEventListener('input', (e) => { _0x5e = e.target.value; renderProducts(); });
    document.getElementById('searchInputMobile').addEventListener('input', (e) => { _0x5e = e.target.value; renderProducts(); });
    document.getElementById('storeFilter').addEventListener('change', (e) => { _0x3c = e.target.value; renderProducts(); });
    document.getElementById('setFilter').addEventListener('change', (e) => { _0x4d = e.target.value; renderProducts(); });
    document.getElementById('minPrice').addEventListener('input', (e) => { _0x6f = parseFloat(e.target.value) || 0; renderProducts(); });
    document.getElementById('maxPrice').addEventListener('input', (e) => { _0x7a = parseFloat(e.target.value) || Infinity; renderProducts(); });
    document.getElementById('resetFilters').addEventListener('click', () => {
        _0x3c = 'All'; _0x4d = 'All'; _0x6f = 0; _0x7a = Infinity; _0x2b = 'All'; _0x5e = '';
        document.getElementById('searchInput').value = ''; document.getElementById('searchInputMobile').value = '';
        updateDropdowns(); renderFilters(); renderProducts();
    });

    const bTT = document.getElementById('backToTop');
    window.onscroll = () => { window.scrollY > 400 ? bTT.classList.add('show') : bTT.classList.remove('show'); };
    bTT.onclick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const tB = document.getElementById('themeToggle');
    const tI = document.getElementById('themeIcon');
    let iD = false;
    tB.addEventListener('click', () => {
        iD = !iD;
        document.documentElement.classList.toggle('dark', iD);
        if (iD) { tI.setAttribute('fill', 'currentColor'); tI.classList.replace('text-gray-600', 'text-yellow-400'); } 
        else { tI.setAttribute('fill', 'none'); tI.classList.replace('text-yellow-400', 'text-gray-600'); }
    });

    fetchData();
    setInterval(fetchData, 1800000);
})();