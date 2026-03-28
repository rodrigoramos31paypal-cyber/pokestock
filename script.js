// --- State Management ---
let allProducts = [];
let currentCategory = 'All';
let selectedStore = 'All';
let selectedSet = 'All';
let searchQuery = '';
let minPrice = 0;
let maxPrice = Infinity;

const CATEGORIES = ['All', 'Elite Trainer Box', 'Booster Box', 'Booster Bundle', 'Collection Boxes', 'Tins', 'Blisters', 'Booster Packs', 'Other'];

const KNOWN_SETS = [
    "Surging Sparks", "Phantasmal Flames", "Prismatic Evolutions", "Stellar Crown", "Shrouded Fable", 
    "Twilight Masquerade", "Temporal Forces", "Paldean Fates", "Paradox Rift", 
    "151", "Obsidian Flames", "Paldea Evolved", "Scarlet & Violet", "Silver Tempest",
    "Lost Origin", "Astral Radiance", "Brilliant Stars", "Fusion Strike", "Celebrations", 
    "Evolving Skies", "Chilling Reign", "Battle Styles", "Shining Fates", "Vivid Voltage"
];

const PRODUCT_CATALOG = [
    { matchGroups: [["phantasmal", "flames", "elite"]], standardName: "Phantasmal Flames - Elite Trainer Box", image: "images/etbph.png" },
    { matchGroups: [["shrouded", "fable", "elite"]], standardName: "Shrouded Fable - Elite Trainer Box", image: "images/etbfable.png" },
    { matchGroups: [["perfect", "order", "elite"]], standardName: "Perfect Order - Elite Trainer Box", image: "images/etbpo.png" }
];

// --- Helper Functions ---

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    let cleaned = priceStr.replace(/[^\d.,]/g, '');
    if (cleaned.includes('.') && cleaned.includes(',')) cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    else if (cleaned.includes(',')) cleaned = cleaned.replace(',', '.');
    return parseFloat(cleaned) || 0;
}

function identifySet(name, url) {
    const text = (name + " " + url).toLowerCase();
    for (const set of KNOWN_SETS) if (text.includes(set.toLowerCase())) return set;
    return name.includes(" - ") ? name.split(" - ")[0] : "Other Sets";
}

/**
 * REFINED CATEGORY LOGIC - PRIORITY FIXED
 * Ensures Booster Boxes take priority over Booster Packs.
 */
function detectCategory(name, url) {
    const text = (name + " " + url).toLowerCase();
    const cleanName = name.toLowerCase();
    
    // 1. ELITE TRAINER BOX (Highest Priority)
    if (text.includes("elite trainer box") || text.includes("etb") || text.includes("elitetrainer")) return "Elite Trainer Box";

    // 2. BOOSTER BOX
    if ((text.includes("booster box") || text.includes("half booster box") || text.includes("display")) && !text.includes("booster bundle")) return "Booster Box";
    if (cleanName.includes("36") && cleanName.includes("booster") && !text.includes("bundle")) return "Booster Box";

    // 3. BOOSTER BUNDLE
    if (text.includes("booster bundle")) return "Booster Bundle";

    // 4. BLISTERS
    if (cleanName.includes("blister") || cleanName.includes("tech") || cleanName.includes("3-pack blister") || cleanName.includes("checklane")) return "Blisters";

    // 5. TINS
    if (cleanName.includes("tin")) return "Tins";

    // 6. COLLECTION BOXES (Strict Keywords)
    const collectionKeywords = ["ultra", "premium", "collection", "ex box", "special"];
    if (collectionKeywords.some(kw => cleanName.includes(kw))) return "Collection Boxes";

    // 7. BOOSTER PACKS
    if (text.includes("pack") || text.includes("booster") || text.includes("sleeved")) return "Booster Packs";

    // 8. OTHERS (Accessories fallback)
    if (text.includes("binder") || text.includes("poster") || (text.includes("sleeve") && !text.includes("sleeved")) || text.includes("portfolio") || text.includes("portfólio") || text.includes("acrilico") || text.includes("acrílico") || text.includes("deck")) return "Other";

    return "Other";
}

function getStoreName(url) {
    try { return new URL(url).hostname.replace(/^www\./, '').split('.')[0].toUpperCase(); } 
    catch { return "STORE"; }
}

function standardizeProduct(originalName, originalUrl, originalImg) {
    let textToSearch = (originalName + " " + originalUrl).toLowerCase().replace(/[^a-z0-9]/g, ' ');
    for (const item of PRODUCT_CATALOG) {
        for (const wordGroup of item.matchGroups) {
            if (wordGroup.every(word => textToSearch.includes(word))) return { name: item.standardName, img: item.image };
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

    storeSelect.innerHTML = '<option value="All">All Stores</option>' + availableStores.map(s => `<option value="${s}" ${s === prevStore ? 'selected' : ''}>${s}</option>`).join('');
    setSelect.innerHTML = '<option value="All">All Sets</option>' + availableSets.map(s => `<option value="${s}" ${s === prevSet ? 'selected' : ''}>${s}</option>`).join('');
}

function renderFilters() {
    const container = document.getElementById('filterContainer');
    container.innerHTML = CATEGORIES.map(cat => `<button onclick="setCategory('${cat}')" class="px-4 py-2 rounded-full text-sm font-medium transition border ${currentCategory === cat ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600'}">${cat}</button>`).join('');
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const filtered = allProducts.filter(p => {
        const matchCat = currentCategory === 'All' || p.category === currentCategory;
        const matchStore = selectedStore === 'All' || p.store === selectedStore;
        const matchSet = selectedSet === 'All' || p.set === selectedSet;
        const matchPrice = p.price >= minPrice && p.price <= maxPrice;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.store.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchStore && matchSet && matchPrice && matchSearch;
    });

    document.getElementById('productCount').textContent = `${filtered.length} products found`;
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-20 text-center text-gray-500">No products match these filters.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition">
            <div class="h-48 bg-white flex items-center justify-center p-2">
                <img src="${p.img}" 
                     referrerpolicy="no-referrer"
                     class="h-full w-full object-contain mix-blend-multiply" 
                     onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <div class="flex justify-between items-start mb-1"><span class="text-[10px] font-bold text-red-500 uppercase tracking-tighter">${p.store}</span><span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">${p.set}</span></div>
                <h3 class="text-sm font-semibold mb-3 line-clamp-2">${p.name}</h3>
                <div class="mt-auto flex justify-between items-center"><span class="text-lg font-bold">€${p.price.toFixed(2)}</span><a href="${p.url}" target="_blank" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">BUY NOW</a></div>
            </div>
        </div>
    `).join('');
}

async function fetchProducts() {
    try {
        const response = await fetch(`seen_products.json?t=${Date.now()}`);
        const data = await response.json();
        allProducts = [];
        for (const key in data) {
            const product = data[key];
            if (product.in_stock) {
                const clean = standardizeProduct(product.name, product.url, product.img);
                allProducts.push({ name: clean.name, img: clean.img, url: product.url, price: parsePrice(product.price), store: getStoreName(product.url), category: detectCategory(clean.name, product.url), set: identifySet(clean.name, product.url) });
            }
        }
        updateDropdowns(); renderFilters(); renderProducts();
        document.getElementById('lastUpdated').textContent = `Sync: ${new Date().toLocaleTimeString()}`;
    } catch (e) { console.error("Error loading products:", e); }
}

function setCategory(cat) { currentCategory = cat; updateDropdowns(); renderFilters(); renderProducts(); }

// Listeners
document.getElementById('searchInput').addEventListener('input', (e) => { searchQuery = e.target.value; renderProducts(); });
document.getElementById('searchInputMobile').addEventListener('input', (e) => { searchQuery = e.target.value; renderProducts(); });
document.getElementById('storeFilter').addEventListener('change', (e) => { selectedStore = e.target.value; renderProducts(); });
document.getElementById('setFilter').addEventListener('change', (e) => { selectedSet = e.target.value; renderProducts(); });
document.getElementById('minPrice').addEventListener('input', (e) => { minPrice = parseFloat(e.target.value) || 0; renderProducts(); });
document.getElementById('maxPrice').addEventListener('input', (e) => { maxPrice = parseFloat(e.target.value) || Infinity; renderProducts(); });

document.getElementById('resetFilters').addEventListener('click', () => {
    selectedStore = 'All'; selectedSet = 'All'; minPrice = 0; maxPrice = Infinity; currentCategory = 'All'; searchQuery = '';
    document.getElementById('searchInput').value = ''; document.getElementById('searchInputMobile').value = '';
    updateDropdowns(); renderFilters(); renderProducts();
});

const backToTopBtn = document.getElementById('backToTop');
window.onscroll = () => { window.scrollY > 400 ? backToTopBtn.classList.add('show') : backToTopBtn.classList.remove('show'); };
backToTopBtn.onclick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

// Updated Theme Toggle Logic for the Lamp Icon
const themeBtn = document.getElementById('themeToggle');
const lampIcon = document.getElementById('lampIcon');
let isDark = false;

themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    
    if (isDark) {
        // Dark Mode: Fill the lamp with yellow "light"
        lampIcon.setAttribute('fill', 'currentColor');
    } else {
        // Light Mode: Outline only
        lampIcon.setAttribute('fill', 'none');
    }
});

fetchProducts();
setInterval(fetchProducts, 1800000);