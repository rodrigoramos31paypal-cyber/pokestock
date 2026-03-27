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

// --- MASTER PRODUCT CATALOG (Smart Matching) ---
// Just list the required words. If ALL words in a group are found, it's a match!
const PRODUCT_CATALOG = [
    // --- ELITE TRAINER BOXES ---
    {
        matchGroups: [ ["phantasmal", "flames", "elite"], ["phantasmal", "flames", "etb"], ["phantasmal", "flames", "elitetrainer"] ],
        standardName: "Phantasmal Flames - Elite Trainer Box",
        image: "images/etbph.png" // Update with your actual image path
    },
    {
        matchGroups: [ ["mega", "evolution", "elite", "lucario"], ["mega", "evolution", "etb", "lucario"], ["mega", "evolution", "elitetrainer", "lucario"] ],
        standardName: "Mega Evolution Lucario - Elite Trainer Box",
        image: "images/etbluca.png"
    },
    {
        matchGroups: [ ["ascended", "heroes", "elite"], ["ascended", "heroes", "etb"], ["ascended", "heroes", "elitetrainer"] ],
        standardName: "Ascended Heroes - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["destined", "rivals", "elite"], ["destined", "rivals", "etb"], ["destined", "rivals", "elitetrainer"] ],
        standardName: "Destined Rivals - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["stellar", "crown", "elite"], ["stellar", "crown", "etb"], ["stellar", "crown", "elitetrainer"] ],
        standardName: "Stellar Crown - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["twilight", "masquerade", "elite"], ["twilight", "masquerade", "etb"], ["twilight", "masquerade", "elitetrainer"] ],
        standardName: "Twilight Masquerade - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["paldean", "fates", "elite"], ["paldean", "fates", "etb"], ["paldean", "fates", "elitetrainer"] ],
        standardName: "Paldean Fates - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["paradox", "rift", "elite"], ["paradox", "rift", "etb"], ["paradox", "rift", "elitetrainer"] ],
        standardName: "Paradox Rift - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["paldea", "evolved", "elite"], ["paldea", "evolved", "etb"], ["paldea", "evolved", "elitetrainer"] ],
        standardName: "Paldea Evolved - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["151", "elite"], ["151", "etb"], ["151", "elitetrainer"] ],
        standardName: "Scarlet & Violet 151 - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["pokemon", "go", "elite"], ["pokemon", "go", "etb"], ["pokemon", "go", "elitetrainer"] ],
        standardName: "Pokémon GO - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["shrouded", "fable", "elite"], ["shrouded", "fable", "etb"], ["shrouded", "fable", "elitetrainer"] ],
        standardName: "Shrouded Fable - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["journey", "together", "elite"], ["journey", "together", "etb"], ["journey", "together", "elitetrainer"] ],
        standardName: "Journey Together - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["black", "bolt", "elite"], ["black", "bolt", "etb"], ["black", "bolt", "elitetrainer"] ],
        standardName: "Black Bolt - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["white", "flare", "elite"], ["white", "flare", "etb"], ["white", "flare", "elitetrainer"] ],
        standardName: "White Flare - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        // Prismatic Evolutions is tricky because stores sometimes write "Evolution" instead of "Evolutions"
        matchGroups: [ 
            ["prismatic", "evolutions", "elite"], ["prismatic", "evolutions", "etb"], ["prismatic", "evolutions", "elitetrainer"],
            ["prismatic", "evolution", "elite"], ["prismatic", "evolution", "etb"], ["prismatic", "evolution", "elitetrainer"]
        ],
        standardName: "Prismatic Evolutions - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["shining", "fates", "elite"], ["shining", "fates", "etb"], ["shining", "fates", "elitetrainer"] ],
        standardName: "Shining Fates - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["obsidian", "flames", "elite"], ["obsidian", "flames", "etb"], ["obsidian", "flames", "elitetrainer"] ],
        standardName: "Obsidian Flames - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["astral", "radiance", "elite"], ["astral", "radiance", "etb"], ["astral", "radiance", "elitetrainer"] ],
        standardName: "Astral Radiance - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["mega", "gardevoir", "elite"], ["mega", "gardevoir", "etb"], ["mega", "gardevoir", "elitetrainer"] ],
        standardName: "Mega Gardevoir - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["mega", "lucario", "elite"], ["mega", "lucario", "etb"], ["mega", "lucario", "elitetrainer"] ],
        standardName: "Mega Lucario - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    }

    // --- You can start adding Collection Boxes or Booster Boxes below this line later! ---
];

function standardizeProduct(originalName, originalUrl, originalImg) {
    // 1. Combine name & url, make lowercase
    let textToSearch = (originalName + " " + originalUrl).toLowerCase();
    
    // 2. MAGIC TRICK: Replace all punctuation (hyphens, brackets, colons) with spaces
    // This turns "Flames - Elite (ENG)" into "flames   elite  eng "
    textToSearch = textToSearch.replace(/[^a-z0-9]/g, ' ');
    
    for (const item of PRODUCT_CATALOG) {
        // Check each group of required words
        for (const wordGroup of item.matchGroups) {
            
            // If EVERY word in this specific group is found in the text, we have a match!
            const isMatch = wordGroup.every(word => textToSearch.includes(word));
            
            if (isMatch) {
                return {
                    name: item.standardName,
                    img: item.image
                };
            }
        }
    }
    
    // If no match, return original
    return {
        name: originalName,
        img: originalImg
    };
}

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