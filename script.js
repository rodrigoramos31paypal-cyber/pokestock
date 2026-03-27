// --- State ---
let allProducts = [];
let currentCategory = 'All';

// --- Category Logic ---
const CATEGORIES = [
    'All', 
    'Elite Trainer Box', 
    'Booster Box', 
    'Build & Battle',
    'Collection Boxes',
    'Tins',
    'Blisters',
    'Booster Packs',
    'Other'
];

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

// --- Store Name Extractor ---
function getStoreName(url) {
    try {
        const hostname = new URL(url).hostname;
        const storePart = hostname.replace(/^www\./, '').split('.')[0];
        return storePart.charAt(0).toUpperCase() + storePart.slice(1);
    } catch {
        return "Unknown Store";
    }
}

// --- MASTER PRODUCT CATALOG (Normalization) ---
// Add your product rules here! 
const PRODUCT_CATALOG = [
    {
        // We look for these keywords in the messy name/url
        keywords: ["phantasmal flames elite trainer box", "phantasmal flames etb", "phantasmal flames - elite"],
        // If found, we force it to use this exact Name and Image:
        standardName: "Phantasmal Flames - Elite Trainer Box",
        image: "images/etbph.png"
    },
    {
        keywords: ["v memories collection", "v-memories collection", "v memories"],
        standardName: "Celebrations: V Memories Collection",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        keywords: ["mega evolution build", "mega evolution b&b"],
        standardName: "Mega Evolution - Build & Battle Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    }
    // Add new products here as you find them!
];

function standardizeProduct(originalName, originalUrl, originalImg) {
    const textToSearch = (originalName + " " + originalUrl).toLowerCase();
    
    for (const item of PRODUCT_CATALOG) {
        // If any of the keywords for this item are found in the store's text
        const isMatch = item.keywords.some(keyword => textToSearch.includes(keyword));
        
        if (isMatch) {
            return {
                name: item.standardName,
                img: item.image
            };
        }
    }
    
    // If we don't have a rule for it yet, return the store's original data
    return {
        name: originalName,
        img: originalImg
    };
}

// --- Fetch & Process Data ---
async function fetchProducts() {
    try {
        const response = await fetch(`seen_products.json?t=${new Date().getTime()}`);
        const data = await response.json();
        
        allProducts = [];
        
        for (const key in data) {
            const product = data[key];
            
            if (product.in_stock) {
                // 1. Standardize the Name and Image first!
                const cleanData = standardizeProduct(product.name, product.url, product.img);
                product.displayName = cleanData.name;
                product.displayImg = cleanData.img;
                
                // 2. Detect category (using our newly cleaned name for better accuracy)
                product.category = detectCategory(product.displayName, product.url);
                
                // 3. Get Store Name
                product.storeName = getStoreName(product.url);
                
                allProducts.push(product);
            }
        }
        
        document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleTimeString()} (Updates every 30 mins)`;
        renderProducts();
        
    } catch (error) {
        console.error("Failed to fetch products:", error);
        document.getElementById('lastUpdated').textContent = "Error loading data. Retrying soon...";
    }
}

// --- Render UI ---
function renderFilters() {
    const container = document.getElementById('filterContainer');
    container.innerHTML = '';
    
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition duration-200 border";
        const activeClasses = "bg-red-600 text-white border-red-600";
        const inactiveClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700";
        
        btn.className = `${baseClasses} ${currentCategory === cat ? activeClasses : inactiveClasses}`;
        
        btn.onclick = () => {
            currentCategory = cat;
            renderFilters(); 
            renderProducts();
        };
        
        container.appendChild(btn);
    });
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    
    const filtered = currentCategory === 'All' 
        ? allProducts 
        : allProducts.filter(p => p.category === currentCategory);
        
    if (filtered.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">No items found in this category.</p>`;
        return;
    }

    filtered.forEach(product => {
        // Fallback in case a store image is completely missing
        const safeImg = product.displayImg || 'https://via.placeholder.com/300x300?text=No+Image';
        
        const card = document.createElement('div');
        card.className = "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition";
        
        card.innerHTML = `
            <div class="h-48 w-full bg-white flex items-center justify-center p-2">
                <img src="${safeImg}" 
                     alt="${product.displayName}" 
                     class="max-h-full max-w-full object-contain mix-blend-multiply"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x300?text=Image+Not+Found';">
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <span class="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">${product.storeName}</span>
                <h3 class="text-sm font-semibold mb-2 line-clamp-2" title="${product.displayName}">${product.displayName}</h3>
                <div class="mt-auto flex justify-between items-center">
                    <span class="text-lg font-bold">${product.price}</span>
                    <a href="${product.url}" target="_blank" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">Buy Now</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- Theme Toggle ---
const themeBtn = document.getElementById('themeToggle');
let isDark = false; 

themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// --- Initialization ---
renderFilters();
fetchProducts();
setInterval(fetchProducts, 1800000);