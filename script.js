(function() {
    // === 🛡️ SECURITY ===
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = function(e) { if (e.keyCode == 123) return false; if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) return false; if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; };

    // === 🧠 LOGIC ===
    let _0x1a = [];
    let _0x2b = 'All';
    let _0x3c = 'All';
    let _0x4d = 'All';
    let _0x5e = '';
    let _0xMaxP = 500;

    const _0x8b = ['All', 'Elite Trainer Box', 'Booster Box', 'Booster Bundle', 'Collection Boxes', 'Tins', 'Blisters', 'Booster Packs', 'Other'];
    const _0x9c = ["Surging Sparks", "Phantasmal Flames", "Prismatic Evolutions", "Stellar Crown", "Shrouded Fable", "Twilight Masquerade", "Temporal Forces", "Paldean Fates", "Paradox Rift", "Obsidian Flames", "Paldea Evolved", "Scarlet & Violet", "Silver Tempest", "Lost Origin", "Astral Radiance", "Brilliant Stars", "Fusion Strike", "Celebrations", "Evolving Skies", "Chilling Reign", "Battle Styles", "Shining Fates", "Vivid Voltage", "Ascended Heroes", "Black & White", "Chaos Rising", "Mega Evolution", "Perfect Order", "Destined Rivals", "Pokémon World Championship", "Journey Together"];

    const _tags = { 'DIVER': 'bg-blue-100 text-blue-600', 'COLECCIONAR': 'bg-purple-100 text-purple-600', 'ARENAPORTO': 'bg-orange-100 text-orange-600', 'ROTA151': 'bg-green-100 text-green-600', 'DEFAULT': 'bg-red-100 text-red-600' };

    // Standard Names Catalog - Expansion point for more products
    const _0x10a = [
        { m: [["phantasmal", "flames", "elite"]], s: "Phantasmal Flames - Elite Trainer Box", i: "images/etbph.png" },
        { m: [["shrouded", "fable", "elite"]], s: "Shrouded Fable - Elite Trainer Box", i: "images/etbfable.png" },
        { m: [["perfect", "order", "elite"]], s: "Perfect Order - Elite Trainer Box", i: "images/etbpo.png" }
    ];

    function _0x11b(_v) { if (!_v) return 0; let c = _v.replace(/[^\d.,]/g, '').replace(',', '.'); return parseFloat(c) || 0; }

    function _0x12c(_n) {
        const _nn = _n.toLowerCase();
        if (_nn.includes("charizard") && (_nn.includes("tin") || _nn.includes("premium"))) return "Phantasmal Flames";
        if (_nn.includes("world championship")) return "Pokémon World Championship";
        if (_nn.includes("mega evolution")) return "Mega Evolution";
        for (const _s of _0x9c) if (_nn.includes(_s.toLowerCase())) return _s;
        return "Other Sets";
    }

    function _0x13d(_n) {
        const _t = _n.toLowerCase();
        if (_t.includes("elite trainer") || _t.includes("etb")) return _0x8b[1];
        if (_t.includes("booster box") || _t.includes("display")) return _0x8b[2];
        if (_t.includes("bundle")) return _0x8b[3];
        if (_t.includes("tin")) return _0x8b[5];
        if (["ultra", "premium", "collection", "ex box"].some(k => _t.includes(k))) return _0x8b[4];
        if (_t.includes("pack") || _t.includes("booster")) return _0x8b[7];
        return _0x8b[8];
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
        const cM = _0x1a.filter(p => _0x2b === 'All' || p.category === _0x2b);
        const aS = [...new Set(cM.map(p => p.store))].sort();
        const aT = [...new Set(cM.map(p => p.set))].sort();
        sS.innerHTML = '<option value="All">All Stores</option>' + aS.map(s => `<option value="${s}" ${_0x3c === s ? 'selected' : ''}>${s}</option>`).join('');
        sT.innerHTML = '<option value="All">All Sets</option>' + aT.map(s => `<option value="${s}" ${_0x4d === s ? 'selected' : ''}>${s}</option>`).join('');
    };

    window.setCategory = function(cat) { _0x2b = cat; updateDropdowns(); renderFilters(); renderProducts(); };

    window.renderFilters = function() {
        const c = document.getElementById('filterContainer');
        c.innerHTML = _0x8b.map(cat => {
            const isActive = _0x2b === cat;
            return `<button onclick="setCategory('${cat}')" class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border ${isActive ? 'bg-gradient-to-r from-red-600 to-red-500 text-white border-transparent shadow-lg shadow-red-500/40 scale-105' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700 hover:border-red-200'}">${cat}</button>`;
        }).join('');
    };

    window.renderProducts = function() {
        const g = document.getElementById('productGrid');
        const f = _0x1a.filter(p => {
            const mC = _0x2b === 'All' || p.category === _0x2b;
            const mS = _0x3c === 'All' || p.store === _0x3c;
            const mT = _0x4d === 'All' || p.set === _0x4d;
            const mP = p.price <= _0xMaxP;
            const mH = p.name.toLowerCase().includes(_0x5e.toLowerCase());
            return mC && mS && mT && mP && mH;
        });

        // GLOBAL NORMALIZATION - Applies to every product
        const minPrices = {};
        f.forEach(p => {
            const norm = p.name.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
            if (!minPrices[norm] || p.price < minPrices[norm]) {
                minPrices[norm] = p.price;
            }
        });

        document.getElementById('productCount').textContent = `${f.length} items found`;
        g.innerHTML = f.map(p => {
            const tagStyle = _tags[p.store] || _tags['DEFAULT'];
            const norm = p.name.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
            const isBestPrice = p.price === minPrices[norm];

            return `
            <div class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/40 dark:shadow-none border border-transparent dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10">
                ${isBestPrice ? `<div class="absolute top-3 right-3 z-10 bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 animate-bounce"><span class="text-xs">⭐</span> BEST PRICE</div>` : ''}
                <div class="h-52 bg-white flex items-center justify-center p-6 overflow-hidden">
                    <img src="${p.img}" referrerpolicy="no-referrer" class="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                </div>
                <div class="p-5 flex flex-col flex-grow bg-white dark:bg-gray-800">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${tagStyle}">${p.store}</span>
                        <span class="text-[9px] font-bold text-gray-400 uppercase">${p.set}</span>
                    </div>
                    <h3 class="text-sm font-bold mb-4 line-clamp-2 h-10 group-hover:text-red-600 transition-colors">${p.name}</h3>
                    <div class="mt-auto flex justify-between items-center">
                        <span class="text-xl font-black ${isBestPrice ? 'text-red-600' : 'text-gray-900 dark:text-white'}">€${p.price.toFixed(2)}</span>
                        <a href="${p.url}" target="_blank" class="px-5 py-2.5 bg-gray-900 dark:bg-red-600 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-gray-900/10 dark:shadow-red-600/20">View Deal</a>
                    </div>
                </div>
            </div>`;
        }).join('');
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
                    _0x1a.push({ name: cl.name, img: cl.img, url: p.url, price: _0x11b(p.price), store: new URL(p.url).hostname.replace(/^www\./, '').split('.')[0].toUpperCase(), category: _0x13d(cl.name), set: _0x12c(cl.name) });
                }
            }
            updateDropdowns(); renderFilters(); renderProducts();
            document.getElementById('lastUpdated').textContent = `Sync: ${new Date().toLocaleTimeString()}`;
        } catch (e) { console.error("ERR"); }
    }

    const slider = document.getElementById('priceSlider');
    const label = document.getElementById('priceLabel');
    slider.addEventListener('input', (e) => {
        _0xMaxP = parseInt(e.target.value);
        label.textContent = `€${_0xMaxP}`;
        renderProducts();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => { _0x5e = e.target.value; renderProducts(); });
    document.getElementById('searchInputMobile').addEventListener('input', (e) => { _0x5e = e.target.value; renderProducts(); });
    document.getElementById('storeFilter').addEventListener('change', (e) => { _0x3c = e.target.value; renderProducts(); });
    document.getElementById('setFilter').addEventListener('change', (e) => { _0x4d = e.target.value; renderProducts(); });
    document.getElementById('resetFilters').addEventListener('click', () => { 
        _0x3c = 'All'; _0x4d = 'All'; _0xMaxP = 500; _0x2b = 'All'; _0x5e = ''; 
        slider.value = 500; label.textContent = '€500';
        fetchData(); 
    });

    const bTT = document.getElementById('backToTop');
    window.onscroll = () => { window.scrollY > 400 ? bTT.classList.add('show') : bTT.classList.remove('show'); };
    bTT.onclick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const tB = document.getElementById('themeToggle');
    const tI = document.getElementById('themeIcon');
    let iD = false;
    tB.addEventListener('click', () => { iD = !iD; document.documentElement.classList.toggle('dark', iD); if (iD) { tI.setAttribute('fill', 'currentColor'); tI.classList.replace('text-gray-500', 'text-yellow-400'); } else { tI.setAttribute('fill', 'none'); tI.classList.replace('text-yellow-400', 'text-gray-500'); } });

    fetchData();
    setInterval(fetchData, 1800000);
})();