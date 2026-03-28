// --- State Management ---
let allProducts = [];
let currentCategory = 'All';
let selectedStore = 'All';
let selectedSet = 'All';
let minPrice = 0;
let maxPrice = Infinity;

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

// --- MASTER PRODUCT CATALOG (Smart Matching) ---
const PRODUCT_CATALOG = [
    {
        // TARGET: Phantasmal Flames Elite Trainer Boxes
        matchGroups: [ 
            ["phantasmal", "flames", "elite"], 
            ["phantasmal", "flames", "etb"], 
            ["phantasmal", "flames", "elitetrainer"] 
        ],
        standardName: "Phantasmal Flames - Elite Trainer Box",
        image: "images/etbph.png" // Your local high-quality image
    },
    {
        matchGroups: [ 
            ["mega", "evolution", "elite", "lucario"], 
            ["mega", "evolution", "etb", "lucario"], 
            ["mega", "evolution", "elitetrainer", "lucario"] 
        ],
        standardName: "Mega Evolution Lucario - Elite Trainer Box",
        image: "images/etbluca.png" // Your local high-quality image
    },
	{
        matchGroups: [ 
            ["mega", "evolution", "elite", "gardevoir"], 
            ["mega", "evolution", "etb", "gardevoir"], 
            ["mega", "evolution", "elitetrainer", "gardevoir"] 
        ],
        standardName: "Mega Evolution Gardevoir - Elite Trainer Box",
        image: "images/etbgar.png" // Your local high-quality image
    },
    {
        matchGroups: [ ["ascended", "heroes", "elite"], ["ascended", "heroes", "etb"] ],
        standardName: "Ascended Heroes - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
	{
        matchGroups: [ 
            ["perfect", "order", "elite"], 
            ["perfect", "order", "etb"], 
            ["perfect", "order", "elitetrainer"] 
        ],
        standardName: "Perfect Order - Elite Trainer Box",
        image: "images/etbpo.png" // Your local high-quality image
    },
    {
        matchGroups: [ ["destined", "rivals", "elite"], ["destined", "rivals", "etb"] ],
        standardName: "Destined Rivals - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["stellar", "crown", "elite"], ["stellar", "crown", "etb"] ],
        standardName: "Stellar Crown - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["twilight", "masquerade", "elite"], ["twilight", "masquerade", "etb"] ],
        standardName: "Twilight Masquerade - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["paldean", "fates", "elite"], ["paldean", "fates", "etb"] ],
        standardName: "Paldean Fates - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["paradox", "rift", "elite"], ["paradox", "rift", "etb"] ],
        standardName: "Paradox Rift - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["paldea", "evolved", "elite"], ["paldea", "evolved", "etb"] ],
        standardName: "Paldea Evolved - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ ["151", "elite"], ["151", "etb"] ],
        standardName: "Scarlet & Violet 151 - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    },
    {
        matchGroups: [ 
            ["shrouded", "fable", "elite"], 
            ["shrouded", "fable", "etb"], 
            ["shrouded", "fable", "elitetrainer"] 
        ],
        standardName: "Shrouded Fable - Elite Trainer Box",
        image: "images/etbfable.png" // Your local high-quality image
    },
    {
        matchGroups: [ ["prismatic", "evolutions", "elite"], ["prismatic", "evolutions", "etb"] ],
        standardName: "Prismatic Evolutions - Elite Trainer Box",
        image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
    }
];

// --- Helper Functions ---

/**
 * FIXED: European Price Parser
 * Correctly handles "1.150,00 €" by removing dots (thousands) and converting comma to dot (decimal).
 */
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    // Keep only digits, dots, and commas
    let cleaned = priceStr.replace(/[^\d.,]/g, '');
    
    // If both exist (e.g., 1.150,00), remove the dot (thousands)
    if (cleaned.includes('.') && cleaned.includes(',')) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } 
    // If only comma exists (e.g., 15,99)
    else if (cleaned.includes(',')) {
        cleaned = cleaned.replace(',', '.');
    }
    // Note: If only dot exists, parseFloat handles it naturally.
    
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
 * FIXED: Category Priority and Rules
 * 1. Portfolios & Acrylic cases -> Others
 * 2. Premium & Collections -> Collection Boxes
 */
function detectCategory(name, url) {
    const text = (name + " " + url).toLowerCase();
    
    // 1. Supplies/Accessories Priority (Other)
    if (text.includes("portfólio") || text.includes("portfolio") || 
        text.includes("acrílico") || text.includes("acrilico")) return "Other";

    // 2. High Priority Specifics
    if (text.includes("elite trainer box") || text.includes("etb")) return "Elite Trainer Box";
    if (text.includes("tin")) return "Tins";
    if (text.includes("blister") || text.includes("3-pack") || text.includes("checklane")) return "Blisters";
    if (text.includes("build & battle") || text.includes("stadium") || text.includes("b&b")) return "Build & Battle";
    
    // 3. Booster Box (Ensure no bundles/packs)
    if ((text.includes("booster box") || text.includes("half booster box") || text.includes("display") || text.includes("36")) && 
        !text.includes("bundle") && !text.includes("pack")) {
        return "Booster Box";
    }

    // 4. Collection Boxes (New Rules: Premium/Collection)
    if (text.includes("collection") || text.includes("premium") || 
        text.includes("upc") || text.includes("box") || 
        text.includes("bundle") || text.includes("deck")) {
        return "Collection Boxes";
    }

    // 5. Booster Packs
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

// --- Logic functions continue (updateDropdowns, renderFilters, renderProducts, fetchProducts, listeners) ---
// (Copy remaining logic from previous turn)