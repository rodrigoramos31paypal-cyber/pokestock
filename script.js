// --- State Management ---
let allProducts = [];
let currentCategory = 'All';
let selectedStore = 'All';
let selectedSet = 'All';
let minPrice = 0;
let maxPrice = Infinity;

// --- Configuration ---
const CATEGORIES = ['All', 'Elite Trainer Box', 'Booster Box', 'Build & Battle', 'Collection Boxes', 'Tins', 'Blisters', 'Booster Packs', 'Other'];

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
    {
        matchGroups: [ ["phantasmal", "flames", "elite"], ["phantasmal", "flames", "etb"], ["phantasmal", "flames", "elitetrainer"] ],
        standardName: "Phantasmal Flames - Elite Trainer Box",
        image: "images/etbph.png"
    }
];

// --- Helper Functions ---

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    let cleaned = priceStr.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
}

function identifySet(name, url) {
    const text = (name + " " + url).toLowerCase();
    for (const set of KNOWN_SETS) {
        if (text.includes(set.toLowerCase())) return set;
    }
    return name.includes(" - ") ? name.split(" - ")[0] : "Other Sets";
}

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

// --- Dynamic Filter Management ---

function updateDropdowns() {
    const storeSelect = document.getElementById('storeFilter');
    const setSelect = document.getElementById('setFilter');
    
    // Save selections
    const prevStore = selectedStore;
    const prevSet = selectedSet;

    // Filter list based ONLY on the current Category tab
    const categoryMatch = allProducts.filter(p => 
        currentCategory === 'All' || p.category === currentCategory
    );

    const availableStores = [...new Set(categoryMatch.map(p => p.store))].sort();
    const availableSets = [...new Set(categoryMatch.map(p => p.set))].sort();

    // Rebuild Store Dropdown
    storeSelect.innerHTML = '<option value="All">All Stores</option>' + 
        availableStores.map(s => `<option value="${s}" ${s === prevStore ? 'selected' : ''}>${s}</option>`).join('');
    selectedStore = availableStores.includes(prevStore) ? prevStore : 'All';

    // Rebuild Set Dropdown
    setSelect.innerHTML = '<option value="All">All Sets</option>' + 
        availableSets.map(s => `<option value="${s}" ${s === prevSet ? 'selected' : ''}>${s}</option>`).join('');
    selectedSet = availableSets.includes(prevSet) ? prevSet : 'All';
}

// --- Rendering Logic ---

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

    // Change p-4 to p-2 to reduce wasted space
	// Add h-full and w-full to the <img> tag
	grid.innerHTML = filtered.map(p => `
		<div class="bg-white dark:bg-gray-800 rounded-xl ...">
			<div class="h-48 bg-white flex items-center justify-center p-2"> 
				<img src="${p.img}" 
					class="h-full w-full object-contain mix-blend-multiply" 
					onerror="...">
			</div>
			...
		</div>
	`).join('');
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
        
        updateDropdowns();
        renderFilters();
        renderProducts();
        document.getElementById('lastUpdated').textContent = `Sync: ${new Date().toLocaleTimeString()}`;
    } catch (e) { console.error("Data error:", e); }
}

// --- Event Listeners ---

function setCategory(cat) { 
    currentCategory = cat; 
    updateDropdowns(); // Cascading update
    renderFilters(); 
    renderProducts(); 
}

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

// Initialize
fetchProducts();
setInterval(fetchProducts, 1800000); // 30 mins