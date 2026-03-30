(function() {
    // === 🛡️ SECURITY ===
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = function(e) { if (e.keyCode == 123) return false; if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) return false; if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; };

    // === 💸 DONATION MODAL & CLIPBOARD LOGIC ===
    const donateModal = document.getElementById('donateModal');
    const donateContent = document.getElementById('donateModalContent');
    const donateBtn = document.getElementById('donateBtn');
    const closeDonate = document.getElementById('closeDonateModal');

    donateBtn.onclick = () => {
        donateModal.classList.remove('invisible', 'opacity-0');
        donateContent.classList.remove('scale-95');
        donateContent.classList.add('scale-100');
    };

    const closeModal = () => {
        donateContent.classList.remove('scale-100');
        donateContent.classList.add('scale-95');
        donateModal.classList.add('opacity-0');
        setTimeout(() => donateModal.classList.add('invisible'), 300);
    };

    closeDonate.onclick = closeModal;
    donateModal.onclick = (e) => { if(e.target === donateModal) closeModal(); };

    window.copyCrypto = function(cryptoName, address) {
        navigator.clipboard.writeText(address).then(() => {
            const toast = document.getElementById('toast');
            document.getElementById('toastMsg').textContent = `${cryptoName} Address Copied!`;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => { toast.classList.add('translate-y-20', 'opacity-0'); }, 3000);
        });
    };

    // === 🧠 LOGIC ===
    let _0x1a = [];
    let _0x2b = 'All';
    let _0x3c = 'All';
    let _0x4d = 'All';
    let _0x5e = '';
    let _0xMaxP = 2000; 
    let _0xSort = 'default'; 

    const _0x8b = ['All', 'Elite Trainer Box', 'Booster Box', 'Half Booster Box', 'Booster Bundle', 'Collection Boxes', 'Tins', 'Other'];
    const _0x9c = ["Surging Sparks", "Phantasmal Flames", "Prismatic Evolutions", "Stellar Crown", "Shrouded Fable", "Twilight Masquerade", "Temporal Forces", "Paldean Fates", "Paradox Rift", "Obsidian Flames", "Paldea Evolved", "Scarlet & Violet", "Silver Tempest", "Lost Origin", "Astral Radiance", "Brilliant Stars", "Fusion Strike", "Celebrations", "Evolving Skies", "Chilling Reign", "Battle Styles", "Shining Fates", "Vivid Voltage", "Ascended Heroes", "Black & White", "Chaos Rising", "Mega Evolution", "Perfect Order", "Destined Rivals", "Pokémon World Championship", "Journey Together", "Rebel Clash", "Crown Zenith"];

    const _0x10a = [
        { m: [["phantasmal", "flames", "elite"]], s: "Phantasmal Flames - Elite Trainer Box" },
        { m: [["phantasmal", "flames", "booster", "box"]], s: "Phantasmal Flames - Booster Box" },
        { m: [["phantasmal", "flames", "booster", "bundle"]], s: "Phantasmal Flames - Booster Bundle" },
        { m: [["surging", "sparks", "booster", "box"]], s: "Surging Sparks - Booster Box" },
        { m: [["surging", "sparks", "booster", "bundle"]], s: "Surging Sparks - Booster Bundle" },
        { m: [["stellar", "crown", "booster", "box"]], s: "Stellar Crown - Booster Box" },
        { m: [["stellar", "crown", "booster", "bundle"]], s: "Stellar Crown - Booster Bundle" },
        { m: [["shrouded", "fable", "elite"]], s: "Shrouded Fable - Elite Trainer Box" },
        { m: [["shrouded", "fable", "booster", "bundle"]], s: "Shrouded Fable - Booster Bundle" },
        { m: [["perfect", "order", "elite"]], s: "Perfect Order - Elite Trainer Box" },
        { m: [["surging", "sparks", "elite"]], s: "Surging Sparks - Elite Trainer Box" },
        { m: [["stellar", "crown", "elite"]], s: "Stellar Crown - Elite Trainer Box" },
        { m: [["black", "bolt", "elite"]], s: "Black Bolt - Elite Trainer Box" },
        { m: [["white", "flare", "elite"]], s: "White Flare - Elite Trainer Box" },
        { m: [["rebel", "clash", "elite"]], s: "Rebel Clash - Elite Trainer Box" },
        { m: [["paldea", "evolved", "elite"]], s: "Paldea Evolved - Elite Trainer Box" }
    ];

    function _0x11b(_v) {
        if (!_v) return 0;
        let c = _v.replace(/[^\d.,]/g, '');
        if (c.includes('.') && c.includes(',')) c = c.replace(/\./g, '').replace(',', '.');
        else if (c.includes(',')) c = c.replace(',', '.');
        return parseFloat(c) || 0;
    }

    function _0x12c(_n) {
        const _nn = _n.toLowerCase();
        if (_nn.includes("portfolio") || _nn.includes("portfólio")) return "Other Sets";
        if (_nn.includes("charizard") && (_nn.includes("tin") || _nn.includes("ultra premium") || _nn.includes("ultra-premium"))) return "Phantasmal Flames";
        if (_nn.includes("black bolt") || _nn.includes("white flare") || _nn.includes("unova")) return "Black & White";
        if (_nn.includes("world championship") || _nn.includes("fernando cifuentes") || _nn.includes("ancient toolbox")) return "Pokémon World Championship";
        if (_nn.includes("destined rivals") || _nn.includes("team rocket")) return "Destined Rivals";
        if (_nn.includes("journey together")) return "Journey Together";
        if (_nn.includes("perfect order")) return "Perfect Order";
        if (_nn.includes("ascended heroes")) return "Ascended Heroes";
        if (_nn.includes("mega evolution") || _nn.includes("mega heroes mini tin") || _nn.includes("mega lucario") || _nn.includes("mega latias") || _nn.includes("mega gardevoir") || _nn.includes("mega kangaskhan")) return "Mega Evolution";
        if (_nn.includes("iono") || _nn.includes("classic") || _nn.includes("cynthia")) return "Other Sets";
        for (const _s of _0x9c) if (_nn.includes(_s.toLowerCase())) return _s;
        return "Other Sets";
    }

    function _0x13d(_n) {
        const _t = _n.toLowerCase();
        if (['deck', 'blister', 'checklane', 'checkla', 'checklan', 'tech', 'binder', 'poster'].some(k => _t.includes(k))) return 'Other';
        if ((_t.includes('pack') || _t.includes('sleeved') || _t.includes('booster')) && !_t.includes('box') && !_t.includes('bundle') && !_t.includes('display') && !_t.includes('tin') && !_t.includes('elite')) return 'Other';
        if (_t.includes('half') || (_t.includes('booster box') && _t.includes('18')) || (_t.includes('display') && _t.includes('18'))) return 'Half Booster Box';
        if (_t.includes('elite trainer') || _t.includes('etb')) return 'Elite Trainer Box';
        if ((_t.includes('booster box') || _t.includes('display')) && !_t.includes('bundle')) return 'Booster Box';
        if (_t.includes('bundle')) return 'Booster Bundle';
        if (_t.includes('tin')) return 'Tins';
        if (['ultra', 'premium', 'collection', 'ex box', 'special', 'upc'].some(k => _t.includes(k))) return 'Collection Boxes';
        return 'Other';
    }

    function _0x15f(_on, _ou, _oi) {
        let _ts = (_on + " " + _ou).toLowerCase().replace(/[^a-z0-9]/g, ' ');
        for (const _it of _0x10a) {
            for (const _wg of _it.m) {
                if (_wg.every(_w => _ts.includes(_w))) return { name: _it.s, img: _it.i || _oi };
            }
        }
        return { name: _on, img: _oi };
    }

    function _0x14e(_u) { try { return new URL(_u).hostname.replace(/^www\./, '').split('.')[0].toUpperCase(); } catch { return "STORE"; } }

    window.updateDropdowns = function() {
        const sS = document.getElementById('storeFilter');
        const sT = document.getElementById('setFilter');
        const cM = _0x1a.filter(p => (_0x2b === 'All' || p.category === _0x2b) && p.price <= _0xMaxP);
        const aS = [...new Set(cM.map(p => p.store))].sort();
        const aT = [...new Set(cM.map(p => p.set))].sort();
        
        sS.innerHTML = '<option value="All">All Stores</option>' + aS.map(s => `<option value="${s}" ${_0x3c === s ? 'selected' : ''}>${s}</option>`).join('');
        sT.innerHTML = '<option value="All">All Sets</option>' + aT.map(s => `<option value="${s}" ${_0x4d === s ? 'selected' : ''}>${s}</option>`).join('');
        _0x3c = sS.value; _0x4d = sT.value;
    };

    window.setCategory = function(cat) { 
        _0x2b = cat; 
        document.getElementById('categorySelect').value = cat; // SYNC SIDEBAR
        updateDropdowns(); 
        renderFilters(); 
        renderProducts(); 
    };

    window.renderFilters = function() {
        const c = document.getElementById('filterContainer');
        c.innerHTML = _0x8b.map(cat => {
            const isActive = _0x2b === cat;
            return `<button onclick="setCategory('${cat}')" class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border ${isActive ? 'bg-gradient-to-r from-red-600 to-red-500 text-white border-transparent shadow-lg shadow-red-500/40 scale-105' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700 hover:border-red-200'}">${cat}</button>`;
        }).join('');
        
        // SYNC DROPDOWN ON INITIAL LOAD
        document.getElementById('categorySelect').value = _0x2b; 
    };

    window.renderProducts = function() {
        const g = document.getElementById('productGrid');
        
        let f = _0x1a.filter(p => {
            const mC = _0x2b === 'All' || p.category === _0x2b;
            const mS = _0x3c === 'All' || p.store === _0x3c;
            const mT = _0x4d === 'All' || p.set === _0x4d;
            const mP = p.price <= _0xMaxP;
            const mH = p.name.toLowerCase().includes(_0x5e.toLowerCase());
            return mC && mS && mT && mP && mH;
        });

        if (_0xSort === 'lowToHigh') {
            f.sort((a, b) => a.price - b.price);
        } else if (_0xSort === 'highToLow') {
            f.sort((a, b) => b.price - a.price);
        }

        document.getElementById('productCount').textContent = `${f.length} items found`;
        g.innerHTML = f.map(p => `
            <div class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/40 dark:shadow-none border border-transparent dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10">
                <div class="h-52 bg-white flex items-center justify-center p-6 overflow-hidden">
                    <img src="${p.img}" referrerpolicy="no-referrer" class="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                </div>
                <div class="p-5 flex flex-col flex-grow bg-white dark:bg-gray-800 transition-colors duration-300">
                    <div class="flex justify-between items-center mb-3 gap-2">
                        <span class="text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 transition-colors duration-300 truncate">${p.store}</span>
                        <span class="text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 transition-colors duration-300 truncate">${p.set}</span>
                    </div>
                    <h3 class="text-sm font-bold mb-4 line-clamp-2 h-10 group-hover:text-red-600 transition-colors duration-300">${p.name}</h3>
                    <div class="mt-auto flex justify-between items-center">
                        <span class="text-xl font-black text-gray-900 dark:text-white transition-colors duration-300">€${p.price.toFixed(2)}</span>
                        <a href="${p.url}" target="_blank" class="px-5 py-2.5 bg-gray-900 dark:bg-red-600 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-gray-900/10 dark:shadow-red-600/20">View Deal</a>
                    </div>
                </div>
            </div>`).join('');
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
        updateDropdowns(); renderProducts();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => { _0x5e = e.target.value; renderProducts(); });
    document.getElementById('searchInputMobile').addEventListener('input', (e) => { _0x5e = e.target.value; renderProducts(); });
    
    // NEW: Category Select Event Listener
    document.getElementById('categorySelect').addEventListener('change', (e) => { setCategory(e.target.value); });
    
    document.getElementById('storeFilter').addEventListener('change', (e) => { _0x3c = e.target.value; updateDropdowns(); renderProducts(); });
    document.getElementById('setFilter').addEventListener('change', (e) => { _0x4d = e.target.value; updateDropdowns(); renderProducts(); });
    document.getElementById('sortFilter').addEventListener('change', (e) => { _0xSort = e.target.value; renderProducts(); });

    document.getElementById('resetFilters').addEventListener('click', () => { 
        _0x3c = 'All'; _0x4d = 'All'; _0xMaxP = 2000; _0x2b = 'All'; _0x5e = ''; _0xSort = 'default';
        slider.value = 2000; label.textContent = '€2000';
        document.getElementById('sortFilter').value = 'default';
        document.getElementById('categorySelect').value = 'All';
        fetchData(); 
    });

    const bTT = document.getElementById('backToTop');
    window.onscroll = () => { window.scrollY > 400 ? bTT.classList.add('show') : bTT.classList.remove('show'); };
    bTT.onclick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

    // === 🌙 THEME TOGGLE LOGIC ===
    const tB = document.getElementById('themeToggle');
    let iD = false;
    tB.addEventListener('click', () => {
        iD = !iD;
        document.documentElement.classList.toggle('dark', iD);
    });

    fetchData();
    setInterval(fetchData, 1800000);
})();