(function() {
    // === 🛡️ SECURITY ===
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = function(e) { 
        if (e.keyCode == 123) return false; 
        if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) return false; 
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; 
    };

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

    // === 🏷️ COUPON HELPER FUNCTION ===
    function getCouponBadge(storeName) {
        const store = storeName.toLowerCase();
        let couponText = "";
        
        if (store.includes("rota151") || store.includes("rota 151")) {
            couponText = "5% OFF: POKESTOCK151";
        } else if (store.includes("drawstep")) {
            couponText = "7% OFF: POKESTOCKDRAWSTEP";
        } else if (store.includes("pokelotas")) {
            couponText = "5% OFF: POKELOTASSTOCK (+50€)";
        } else if (store.includes("manavault")) {
            couponText = "5% OFF: POKESTOCK5";
        }

        if (couponText) {
            return `
                <div class="mb-4 w-full flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-3 py-2 rounded-xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/50 uppercase tracking-widest">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a2 2 0 0 1-2.83 0l-8.97-8.97A2 2 0 0 1 0 9.86V2a2 2 0 0 1 2-2h7.86a2 2 0 0 1 1.41.59l9.19 9.19a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    ${couponText}
                </div>
            `;
        }
        return "";
    }

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
        
        if (_nn.includes("chaos rising")) return "Chaos Rising";
        
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
        if (_on.toLowerCase().includes('booster pack')) {
            return { name: _on, img: _oi };
        }

        let _ts = (_on + " " + _ou).toLowerCase().replace(/[^a-z0-9]/g, ' ');
        for (const _it of _0x10a) {
            for (const _wg of _it.m) {
                if (_wg.every(_w => _ts.includes(_w))) return { name: _it.s, img: _it.i || _oi };
            }
        }
        return { name: _on, img: _oi };
    }

    function _0x14e(_u) { try { return new URL