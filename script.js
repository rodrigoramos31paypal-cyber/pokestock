// --- State Management ---
let allProducts = [];
let currentCategory = 'All';
let selectedStore = 'All';
let selectedSet = 'All';
let minPrice = 0;
let maxPrice = Infinity;

// Removed "Build & Battle" and added "Booster Bundle"
const CATEGORIES = ['All', 'Elite Trainer Box', 'Booster Box', 'Booster Bundle', 'Collection Boxes', 'Tins', 'Blisters', 'Booster Packs', 'Other'];

const KNOWN_SETS = [
    "Phantasmal Flames", "Prismatic Evolutions", "Stellar Crown", "Shrouded Fable", 
    "Twilight Masquerade", "Temporal Forces", "Paldean Fates", "Paradox Rift", 
    "151", "Obsidian Flames", "Paldea Evolved", "Scarlet & Violet", "Silver Tempest",
    "Lost Origin", "Astral Radiance", "Brilliant Stars", "Fusion Strike", "Celebrations", 
    "Evolving Skies", "Chilling Reign", "Battle Styles", "Shining Fates", "Vivid Voltage",
    "Champion's Path", "Darkness Ablaze", "Rebel Clash", "Sword & Shield", "Cosmic Eclipse",
    "Hidden Fates", "Unified Minds", "Unbroken Bonds", "Team Up"
];

// --- Master Product Catalog (Smart Matching) ---
const PRODUCT_CATALOG = [

];

// --- Helper Functions ---

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    let cleaned = priceStr.replace(/[^\d.,]/g, '');
    if (cleaned.includes('.') && cleaned.includes(',')) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (cleaned.includes(',')) {
        cleaned = cleaned.replace(',', '.');
    }
    return parseFloat(cleaned) || 0;
}

function identifySet(name, url) {
    const text = (name + " " + url).toLowerCase();
    for (const set of KNOWN_SETS) {
        if (text.includes(set.toLowerCase())) return set;
    }
    return name.includes(" - ") ? name.split(" - ")[0] : "Other Sets";
}

/**
 * REFINED CATEGORY LOGIC
 */
function detectCategory(name, url) {
    const text = (name + " " + url).toLowerCase();
    const cleanName = name.toLowerCase();
    
    // 1. Others/Accessories Priority: binder, poster, sleeve, portfolio, acrilico, deck
    if (text.includes("binder") || text.includes("poster") || text.includes("sleeve") ||
        text.includes("portfolio") || text.includes("portfólio") || 
        text.includes("acrilico") || text.includes("acrílico") ||
        text.includes("deck")) return "Other";

    // 2. Elite Trainer Box
    if (text.includes("elite trainer box") || text.includes("etb")) return "Elite Trainer Box";

    // 3. Booster Bundle
    if (text.includes("booster bundle")) return "Booster Bundle";

    // 4. Blisters (including tech)
    if (text.includes("blister") || text.includes("3-pack") || text.includes("checklane") || text.includes("tech")) return "Blisters";

    // 5. Tins
    if (text.includes("tin")) return "Tins";

    // 6. Booster Box (Restricted SKU check)
    if ((text.includes("booster box") || text.includes("half booster box") || text.includes("display")) && 
        !text.includes("bundle") && !text.includes("pack")) return "Booster Box";
    if (cleanName.includes("36") && cleanName.includes("booster")) return "Booster Box";

    // 7. Booster Packs
    if (text.includes("packs") || text.includes("booster") || text.includes("pack") || text.includes("sleeved")) return "Booster Packs";

    // 8. Collection Boxes (STRICT FILTER)
    // Only products with: ultra, premium, collection, ex box, special
    const collectionKeywords = ["ultra", "premium", "collection", "ex box", "special"];
    if (collectionKeywords.some(kw => cleanName.includes(kw))) return "Collection Boxes";

    // 9. Default Fallback (Old Build & Battle items fall here)
    return "Other";
}

function getStoreName(url) {
    try {
        const host = new URL(url).hostname.replace(/^www\./, '').split('.')[0];
        return host.charAt(0).toUpperCase() + host.slice(1);
    } catch { return "Unknown Store"; }
}

function standardizeProduct(originalName, originalUrl, originalImg) {
    let textToSearch = (originalName + " " + originalUrl).toLowerCase().replace(/[^a-z0-9]/g, ' ');
    for (const item of PRODUCT_CATALOG) {
        for (const wordGroup of item.matchGroups) {
            if (wordGroup.every(word => textToSearch.includes(word))) {
                return { name: item.standardName, img: item.image };
            }
        }
    }
    return { name: originalName, img: originalImg };
}

// --- UI Rendering ---

function updateDropdowns() {
    const storeSelect = document.getElementById('storeFilter');
    const setSelect = document.getElementById('setFilter');
    
    const prevStore = selectedStore;
    const prevSet = selectedSet;

    const categoryMatch = allProducts.filter(p => currentCategory === 'All' || p.category === currentCategory);
    const availableStores = [...new Set(categoryMatch.map(p => p.store))].sort();
    const availableSets = [...new Set(categoryMatch.map(p => p.set))].sort();

    storeSelect.innerHTML = '<option value="All">All Stores</option>' + 
        availableStores.map(s => `<option value="${s}" ${s === prevStore ? 'selected' : ''}>${s}</option>`).join('');
    selectedStore = availableStores.includes(prevStore) ? prevStore : 'All';

    setSelect.innerHTML = '<option value="All">All Sets</option>' + 
        availableSets.map(s => `<option value="${s}" ${s === prevSet ? 'selected' : ''}>${s}</option>`).join('');
    selectedSet = availableSets.includes(prevSet) ? prevSet : 'All';
}

function renderFilters() {
    const container = document.getElementById('filterContainer');
    container.innerHTML = CATEGORIES.map(cat => {
        const isActive = currentCategory === cat;
        return `<button onclick="setCategory('${cat}')" class="px-4 py-2 rounded-full text-sm font-medium transition border ${isActive ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600'}">${cat}</button>`;
    }).join('');
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const filtered = allProducts.filter(p => {
        const matchCat = currentCategory === 'All' || p.category === currentCategory;
        const matchStore = selectedStore === 'All' || p.store === selectedStore;
        const matchSet = selectedSet === 'All' || p.set === selectedSet;
        const matchPrice = p.price >= minPrice && p.price <= maxPrice;
        return matchCat && matchStore && matchSet && matchPrice;
    });

    document.getElementById('productCount').textContent = `${filtered.length} products found`;

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-20 text-center text-gray-500">No products match these filters.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition">
            <div class="h-48 bg-white flex items-center justify-center p-2">
                <img src="${p.img || 'https://via.placeholder.com/300'}" class="h-full w-full object-contain mix-blend-multiply" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <div class="flex justify-between items-start mb-1">
                    <span class="text-[10px] font-bold text-red-500 uppercase tracking-tighter">${p.store}</span>
                    <span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">${p.set}</span>
                </div>
                <h3 class="text-sm font-semibold mb-3 line-clamp-2">${p.name}</h3>
                <div class="mt-auto flex justify-between items-center">
                    <span class="text-lg font-bold">€${p.price.toFixed(2)}</span>
                    <a href="${p.url}" target="_blank" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">BUY NOW</a>
                </div>
            </div>
        </div>
    `).join('');
}

// --- Data Logic ---

async function fetchProducts() {
    try {
        const response = await fetch(`seen_products.json?t=${Date.now()}`);
        const data = await response.json();
        
        allProducts = [];
        for (const key in data) {
            const product = data[key];
            if (product.in_stock) {
                const clean = standardizeProduct(product.name, product.url, product.img);
                allProducts.push({
                    name: clean.name,
                    img: clean.img,
                    url: product.url,
                    price: parsePrice(product.price),
                    store: getStoreName(product.url),
                    category: detectCategory(clean.name, product.url),
                    set: identifySet(clean.name, product.url)
                });
            }
        }
        updateDropdowns();
        renderFilters();
        renderProducts();
        document.getElementById('lastUpdated').textContent = `Sync: ${new Date().toLocaleTimeString()}`;
    } catch (e) { console.error("Error loading products:", e); }
}

function setCategory(cat) { currentCategory = cat; updateDropdowns(); renderFilters(); renderProducts(); }

// --- Scroll & UI Listeners ---

const backToTopBtn = document.getElementById('backToTop');

window.onscroll = function() {
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
};

backToTopBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.getElementById('storeFilter').addEventListener('change', (e) => { selectedStore = e.target.value; renderProducts(); });
document.getElementById('setFilter').addEventListener('change', (e) => { selectedSet = e.target.value; renderProducts(); });
document.getElementById('minPrice').addEventListener('input', (e) => { minPrice = parseFloat(e.target.value) || 0; renderProducts(); });
document.getElementById('maxPrice').addEventListener('input', (e) => { maxPrice = parseFloat(e.target.value) || Infinity; renderProducts(); });

document.getElementById('resetFilters').addEventListener('click', () => {
    selectedStore = 'All'; selectedSet = 'All'; minPrice = 0; maxPrice = Infinity; currentCategory = 'All';
    document.getElementById('storeFilter').value = 'All';
    document.getElementById('setFilter').value = 'All';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    updateDropdowns(); renderFilters(); renderProducts();
});

const themeBtn = document.getElementById('themeToggle');
let isDark = false;
themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Start
fetchProducts();
setInterval(fetchProducts, 1800000);