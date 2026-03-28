// --- State ---
let allProducts = [];
let currentCategory = 'All';
let selectedStore = 'All';
let selectedSet = 'All';
let minPrice = 0;
let maxPrice = Infinity;

// --- Config ---
const CATEGORIES = ['All', 'Elite Trainer Box', 'Booster Box', 'Build & Battle', 'Collection Boxes', 'Tins', 'Blisters', 'Booster Packs', 'Other'];

// List of known sets to help extraction if not in Catalog
const KNOWN_SETS = [
    "Phantasmal Flames", "Prismatic Evolutions", "Stellar Crown", "Shrouded Fable", 
    "Twilight Masquerade", "Temporal Forces", "Paldean Fates", "Paradox Rift", 
    "151", "Obsidian Flames", "Paldea Evolved", "Scarlet & Violet", "Silver Tempest",
    "Lost Origin", "Astral Radiance", "Brilliant Stars", "Fusion Strike", "Celebrations", 
    "Evolving Skies", "Chilling Reign", "Battle Styles", "Shining Fates", "Vivid Voltage",
    "Champion's Path", "Darkness Ablaze", "Rebel Clash", "Sword & Shield", "Cosmic Eclipse",
    "Hidden Fates", "Unified Minds", "Unbroken Bonds", "Team Up"
];

// --- Helper: Parse Price String to Number ---
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    // Remove currency symbols and non-numeric characters except , and .
    // Example: "15,99 €" -> "15.99"
    let cleaned = priceStr.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
}

// --- Helper: Identify Set ---
function identifySet(name, url) {
    const text = (name + " " + url).toLowerCase();
    
    // Check known sets list
    for (const set of KNOWN_SETS) {
        if (text.includes(set.toLowerCase())) return set;
    }
    
    // If it follows "Set Name - Product" format from Catalog
    if (name.includes(" - ")) return name.split(" - ")[0];
    
    return "Unknown Set";
}

// --- Existing logic from your fixed version ---
function detectCategory(name, url) {
    const text = (name + " " + url).toLowerCase();
    if (text.includes("elite trainer box") || text.includes("etb")) return "Elite Trainer Box";
    if (text.includes("booster box") || text.includes("display") || text.includes("36")) return "Booster Box";
    if (text.includes("build & battle") || text.includes("stadium") || text.includes("b&b")) return "Build & Battle";
    if (text.includes("collection") || text.includes("premium") || text.includes("upc") || text.includes("box") || text.includes("deck")) return "Collection Boxes";
    if (text.includes("tin")) return "Tins";
    if (text.includes("blister") || text.includes("3-pack") || text.includes("checklane")) return "Blisters";
    if (text.includes("booster") || text.includes("pack") || text.includes("sleeved")) return "Booster Packs";
    return "Other";
}

function getStoreName(url) {
    try {
        const host = new URL(url).hostname.replace(/^www\./, '').split('.')[0];
        return host.charAt(0).toUpperCase() + host.slice(1);
    } catch { return "Unknown Store"; }
}

// Paste your PRODUCT_CATALOG and standardizeProduct function here...
// (Using the matchGroups logic we built earlier)
const PRODUCT_CATALOG = [
    {
        matchGroups: [ ["phantasmal", "flames", "elite"], ["phantasmal", "flames", "etb"] ],
        standardName: "Phantasmal Flames - Elite Trainer Box",
        image: "images/etbph.png"
    },
    // ... add all other ETB groups here ...
];

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

// --- Core Data Fetching ---
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
                    priceRaw: product.price,
                    price: parsePrice(product.price),
                    store: getStoreName(product.url),
                    category: detectCategory(clean.name, product.url),
                    set: identifySet(clean.name, product.url)
                });
            }
        }
        
        populateDropdowns();
        renderFilters();
        renderProducts();
        document.getElementById('lastUpdated').textContent = `Sync: ${new Date().toLocaleTimeString()}`;
    } catch (e) { console.error("Data error:", e); }
}

// --- UI Management ---
function populateDropdowns() {
    const storeSelect = document.getElementById('storeFilter');
    const setSelect = document.getElementById('setFilter');
    
    const stores = [...new Set(allProducts.map(p => p.store))].sort();
    const sets = [...new Set(allProducts.map(p => p.set))].sort();

    storeSelect.innerHTML = '<option value="All">All Stores</option>' + 
        stores.map(s => `<option value="${s}">${s}</option>`).join('');
    
    setSelect.innerHTML = '<option value="All">All Sets</option>' + 
        sets.map(s => `<option value="${s}">${s}</option>`).join('');
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
            <div class="h-48 bg-white flex items-center justify-center p-4">
                <img src="${p.img || 'https://via.placeholder.com/300'}" class="max-h-full object-contain mix-blend-multiply" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
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

// --- Event Listeners ---
function setCategory(cat) { currentCategory = cat; renderFilters(); renderProducts(); }

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
    renderFilters(); renderProducts();
});

const themeBtn = document.getElementById('themeToggle');
let isDark = false;
themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Init
fetchProducts();
setInterval(fetchProducts, 1800000);