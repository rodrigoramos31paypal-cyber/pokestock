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
        // Removes 'www.' and '.pt', '.com' etc to get just the brand name
        const storePart = hostname.replace(/^www\./, '').split('.')[0];
        // Capitalize first letter
        return storePart.charAt(0).toUpperCase() + storePart.slice(1);
    } catch {
        return "Unknown Store";
    }
}

// --- Master Image Dictionary ---
// Add your perfect image URLs here. Keep the keys (left side) lowercase!
const MASTER_IMAGES = {
    "phantasmal flames elite trainer box": "images/etbph.png", // Replace with a real ETB image link
    "v memories collection": "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg", // Replace with a real Collection Box image link
    "mega evolution build & battle": "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg" // Replace with real Build & Battle image link
    // Example of how to add more:
    // "charizard ultra premium collection": "https://link-to-perfect-charizard-upc-image.jpg",
};

function getStandardImage(productName, scrapedImg) {
    const lowerName = productName.toLowerCase();
    
    // Check if the product name contains any of our dictionary keys
    for (const [key, masterUrl] of Object.entries(MASTER_IMAGES)) {
        if (lowerName.includes(key)) {
            return masterUrl; // Override with our perfect image!
        }
    }
    return scrapedImg; // If no match, use the store's original image
}

// --- Fetch & Process Data ---
async function fetchProducts() {
    try {
        // Cache busting to ensure we get the latest JSON
        const response = await fetch(`seen_products.json?t=${new Date().getTime()}`);
        const data = await response.json();
        
        allProducts = [];
        
        // Data comes as an object mapping URLs to product objects
        for (const key in data) {
            const product = data[key];
            
            // RULE: Only add if in_stock is true
            if (product.in_stock) {
                product.category = detectCategory(product.name, product.url);
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
        // Styling for active vs inactive state
        const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition duration-200 border";
        const activeClasses = "bg-red-600 text-white border-red-600";
        const inactiveClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700";
        
        btn.className = `${baseClasses} ${currentCategory === cat ? activeClasses : inactiveClasses}`;
        
        btn.onclick = () => {
            currentCategory = cat;
            renderFilters(); // Re-render to update active button styles
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
        // Decide which image to use (Master Dictionary vs Store's image)
        const finalImgSrc = getStandardImage(product.name, product.img) || 'https://via.placeholder.com/300x300?text=No+Image';
        
        const card = document.createElement('div');
        card.className = "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition";
        
        card.innerHTML = `
            <div class="h-48 w-full bg-white flex items-center justify-center p-2">
                <img src="${finalImgSrc}" 
                     alt="${product.name}" 
                     class="max-h-full max-w-full object-contain mix-blend-multiply"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x300?text=Image+Not+Found';">
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <span class="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">${product.storeName}</span>
                <h3 class="text-sm font-semibold mb-2 line-clamp-2" title="${product.name}">${product.name}</h3>
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
let isDark = false; // Default light mode

themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// --- Initialization ---
renderFilters();
fetchProducts();

// Refresh data every 30 minutes (30 * 60 * 1000 ms)
setInterval(fetchProducts, 1800000);