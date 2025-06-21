// scripts/data.js

// --- Constants ---
export const priceCategories = ['Dull', 'Chm', 'Brown', 'Multi', 'Wood'];
export const productTypes = [
    'Aluminum Profiles',
    'Glass',
    'Hardware',
    'Accessories',
    'Sealant',
    'Screws',
    'Panels',
    'PVC',
    'Other'
];
export const LOCAL_STORAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// --- Default Data ---
// Updated defaultProductsData with prices from the provided image for "BLUE METAL" products.
export const defaultProductsData = [
    { id: 'prod-D-10', name: 'D-10', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 332, Chm: 336, Brown: 360, Multi: 376, Wood: 420 }, discount: 0 },
    { id: 'prod-D-23', name: 'D-23', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 288, Chm: 291, Brown: 311, Multi: 326, Wood: 364 }, discount: 0 },
    { id: 'prod-D-24', name: 'D-24', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 286, Chm: 289, Brown: 309, Multi: 324, Wood: 361 }, discount: 0 },
    { id: 'prod-D-25', name: 'D-25', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 224, Chm: 228, Brown: 244, Multi: 255, Wood: 285 }, discount: 0 },
    { id: 'prod-D-26A', name: 'D-26A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 327, Chm: 331, Brown: 354, Multi: 371, Wood: 414 }, discount: 0 },
    { id: 'prod-D-27', name: 'D-27', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 338, Chm: 341, Brown: 365, Multi: 382, Wood: 426 }, discount: 0 },
    { id: 'prod-D-28A', name: 'D-28A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 310, Chm: 313, Brown: 335, Multi: 351, Wood: 391 }, discount: 0 },
    { id: 'prod-D-29', name: 'D-29', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 176, Chm: 178, Brown: 190, Multi: 199, Wood: 223 }, discount: 0 },
    { id: 'prod-D-29A', name: 'D-29A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 213, Chm: 215, Brown: 230, Multi: 241, Wood: 269 }, discount: 0 },
    { id: 'prod-D-29B', name: 'D-29B', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 110, Chm: 111, Brown: 119, Multi: 124, Wood: 139 }, discount: 0 },
    { id: 'prod-D-30', name: 'D-30', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 282, Chm: 286, Brown: 306, Multi: 320, Wood: 358 }, discount: 0 },
    { id: 'prod-D-31', name: 'D-31', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 123, Chm: 124, Brown: 133, Multi: 139, Wood: 155 }, discount: 0 },
    { id: 'prod-D-31A', name: 'D-31A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 309, Chm: 312, Brown: 334, Multi: 349, Wood: 390 }, discount: 0 },
    { id: 'prod-D-40', name: 'D-40', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 309, Chm: 312, Brown: 334, Multi: 349, Wood: 390 }, discount: 0 },
    { id: 'prod-D-41', name: 'D-41', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 118, Chm: 119, Brown: 127, Multi: 133, Wood: 149 }, discount: 0 },
    { id: 'prod-D-42', name: 'D-42', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 206, Chm: 208, Brown: 223, Multi: 233, Wood: 260 }, discount: 0 },
    { id: 'prod-D-45A', name: 'D-45A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 276, Chm: 280, Brown: 300, Multi: 314, Wood: 350 }, discount: 0 },
    { id: 'prod-D-46', name: 'D-46', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 554, Chm: 561, Brown: 600, Multi: 628, Wood: 701 }, discount: 0 },
    { id: 'prod-D-48A', name: 'D-48A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 371, Chm: 376, Brown: 402, Multi: 421, Wood: 470 }, discount: 0 },
    { id: 'prod-D-50', name: 'D-50', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 356, Chm: 360, Brown: 385, Multi: 403, Wood: 450 }, discount: 0 },
    { id: 'prod-D-50A', name: 'D-50A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 316, Chm: 319, Brown: 341, Multi: 357, Wood: 399 }, discount: 0 },
    { id: 'prod-D-50B', name: 'D-50B', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 443, Chm: 449, Brown: 480, Multi: 503, Wood: 561 }, discount: 0 },
    { id: 'prod-D-51', name: 'D-51', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 337, Chm: 344, Brown: 360, Multi: 365, Wood: 424 }, discount: 0 },
    { id: 'prod-D-51A', name: 'D-51A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 291, Chm: 285, Brown: 316, Multi: 330, Wood: 369 }, discount: 0 },
    { id: 'prod-D-51C', name: 'D-51C', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 528, Chm: 534, Brown: 571, Multi: 598, Wood: 668 }, discount: 0 },
    { id: 'prod-D-52', name: 'D-52', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 279, Chm: 282, Brown: 302, Multi: 316, Wood: 353 }, discount: 0 },
    { id: 'prod-D-54A', name: 'D-54A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 413, Chm: 419, Brown: 449, Multi: 469, Wood: 524 }, discount: 0 },
    { id: 'prod-D-54C', name: 'D-54C', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 449, Chm: 454, Brown: 486, Multi: 508, Wood: 568 }, discount: 0 },
    { id: 'prod-D-59', name: 'D-59', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 346, Chm: 349, Brown: 373, Multi: 391, Wood: 436 }, discount: 0 },
    { id: 'prod-D-61', name: 'D-61', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 331, Chm: 335, Brown: 358, Multi: 375, Wood: 419 }, discount: 0 },
    { id: 'prod-DC-26A', name: 'DC-26A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 543, Chm: 549, Brown: 587, Multi: 615, Wood: 686 }, discount: 0 },
    { id: 'prod-DC-26B', name: 'DC-26B', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 446, Chm: 472, Brown: 505, Multi: 529, Wood: 590 }, discount: 0 },
    { id: 'prod-DC-26C', name: 'DC-26C', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 487, Chm: 492, Brown: 526, Multi: 551, Wood: 615 }, discount: 0 },
    { id: 'prod-DC-26E', name: 'DC-26E', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 513, Chm: 520, Brown: 556, Multi: 582, Wood: 650 }, discount: 0 },
    { id: 'prod-DC-26F', name: 'DC-26F', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 565, Chm: 572, Brown: 612, Multi: 641, Wood: 715 }, discount: 0 },
    { id: 'prod-DC-30A', name: 'DC-30A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 469, Chm: 475, Brown: 508, Multi: 532, Wood: 594 }, discount: 0 },
    { id: 'prod-DC-30B', name: 'DC-30B', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 397, Chm: 401, Brown: 429, Multi: 449, Wood: 501 }, discount: 0 },
    { id: 'prod-DC-30C', name: 'DC-30C', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 421, Chm: 427, Brown: 457, Multi: 478, Wood: 534 }, discount: 0 },
    { id: 'prod-DC-30E', name: 'DC-30E', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 440, Chm: 445, Brown: 476, Multi: 498, Wood: 556 }, discount: 0 },
    { id: 'prod-DC-30F', name: 'DC-30F', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 489, Chm: 491, Brown: 525, Multi: 550, Wood: 614 }, discount: 0 },
    { id: 'prod-E-10', name: 'E-10', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 262, Chm: 266, Brown: 285, Multi: 298, Wood: 333 }, discount: 0 },
    { id: 'prod-EF-22', name: 'EF-22', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 147, Chm: 148, Brown: 158, Multi: 166, Wood: 185 }, discount: 0 },
    { id: 'prod-EF-24', name: 'EF-24', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 250, Chm: 252, Brown: 270, Multi: 282, Wood: 315 }, discount: 0 },
    { id: 'prod-EF-25', name: 'EF-25', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 192, Chm: 194, Brown: 208, Multi: 217, Wood: 243 }, discount: 0 },
    { id: 'prod-EF-26', name: 'EF-26', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 250, Chm: 252, Brown: 270, Multi: 282, Wood: 315 }, discount: 0 },
    { id: 'prod-EF-27', name: 'EF-27', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 250, Chm: 252, Brown: 270, Multi: 282, Wood: 315 }, discount: 0 },
    { id: 'prod-EF-28', name: 'EF-28', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 164, Chm: 166, Brown: 178, Multi: 186, Wood: 208 }, discount: 0 },
    { id: 'prod-EF-30', name: 'EF-30', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 191, Chm: 193, Brown: 207, Multi: 216, Wood: 241 }, discount: 0 },
    { id: 'prod-L-39', name: 'L-39', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 143, Chm: 145, Brown: 155, Multi: 162, Wood: 181 }, discount: 0 },
    { id: 'prod-M-23', name: 'M-23', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 228, Chm: 230, Brown: 246, Multi: 258, Wood: 288 }, discount: 0 },
    { id: 'prod-M-24', name: 'M-24', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 269, Chm: 273, Brown: 292, Multi: 306, Wood: 341 }, discount: 0 },
    { id: 'prod-M-24A', name: 'M-24A', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 239, Chm: 242, Brown: 259, Multi: 271, Wood: 303 }, discount: 0 },
    { id: 'prod-M-26', name: 'M-26', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 375, Chm: 379, Brown: 406, Multi: 424, Wood: 474 }, discount: 0 },
    { id: 'prod-M-28', name: 'M-28', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 276, Chm: 280, Brown: 300, Multi: 314, Wood: 350 }, discount: 0 },
    { id: 'prod-M-30', name: 'M-30', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 335, Chm: 339, Brown: 363, Multi: 380, Wood: 424 }, discount: 0 },
    { id: 'prod-Strip-3 6"', name: 'Strip-3 6"', productType: 'Aluminum Profiles', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 279, Chm: 282, Brown: 302, Multi: 316, Wood: 353 }, discount: 0 },
    { id: 'prod-Handle-100', name: 'Handle-100', productType: 'Hardware', brand: 'BLUE METAL', unitType: 'PCS', prices: { Dull: 120, Chm: 130, Brown: 140, Multi: 150, Wood: 160 }, discount: 0 },
    { id: 'prod-Lock-200', name: 'Lock-200', productType: 'Hardware', brand: 'GOLDEN', unitType: 'PCS', prices: { Dull: 250, Chm: 260, Brown: 270, Multi: 280, Wood: 290 }, discount: 0 },
    { id: 'prod-Hinge-300', name: 'Hinge-300', productType: 'Hardware', brand: 'SILVER', unitType: 'PCS', prices: { Dull: 80, Chm: 85, Brown: 90, Multi: 95, Wood: 100 }, discount: 0 },
    { id: 'prod-PAK-ALCO-01', name: 'PAK-ALCO-Section-1', productType: 'Aluminum Profiles', brand: 'Pak Alco', unitType: 'FT', prices: { Dull: 350, Chm: 355, Brown: 370, Multi: 390, Wood: 420 }, discount: 0 },
    { id: 'prod-BLUE-METAL-PLUS-01', name: 'BM-PLUS-Section-1', productType: 'Aluminum Profiles', brand: 'Blue Metal Plus', unitType: 'FT', prices: { Dull: 360, Chm: 365, Brown: 380, Multi: 400, Wood: 430 }, discount: 0 },
    { id: 'prod-LUCKY-ALUM-01', name: 'Lucky-Section-1', productType: 'Aluminum Profiles', brand: 'Lucky Aluminum', unitType: 'FT', prices: { Dull: 340, Chm: 345, Brown: 360, Multi: 380, Wood: 410 }, discount: 0 },
    { id: 'prod-GLASS-01', name: 'Clear Glass 5mm', productType: 'Glass', brand: 'Gani Glass', unitType: 'SQM', prices: { Dull: 500, Chm: 520, Brown: 540, Multi: 560, Wood: 580 }, discount: 0 },
    { id: 'prod-GLASS-02', name: 'Tinted Glass 8mm', productType: 'Glass', brand: 'Gani Glass', unitType: 'SQM', prices: { Dull: 800, Chm: 820, Brown: 840, Multi: 860, Wood: 880 }, discount: 0 },
    { id: 'prod-HARDWARE-DELWALET-01', name: 'Delwalet Handle', productType: 'Hardware', brand: 'Delwalet', unitType: 'PCS', prices: { Dull: 150, Chm: 155, Brown: 160, Multi: 165, Wood: 170 }, discount: 0 },
    { id: 'prod-HARDWARE-TOTAL-01', name: 'Total Lock', productType: 'Hardware', brand: 'Total', unitType: 'BOX', prices: { Dull: 1200, Chm: 1250, Brown: 1300, Multi: 1350, Wood: 1400 }, discount: 0 },
    { id: 'prod-HARDWARE-DELWALET-02', name: 'Delwalet Hinge', productType: 'Hardware', brand: 'Delwalet', unitType: 'DOZEN', prices: { Dull: 900, Chm: 950, Brown: 1000, Multi: 1050, Wood: 1100 }, discount: 0 },
    { id: 'prod-D25-BM', name: 'D25', productType: 'Deluxe Section', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 263, Chm: 262, Brown: 270, Wood: 315 }, discount: 0 },
    { id: 'prod-D26A-BM', name: 'D26A', productType: 'Deluxe Section', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 391, Chm: 391, Brown: 457, Wood: 495 }, discount: 0 },
    { id: 'prod-D27-BM', name: 'D27', productType: 'Deluxe Section', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 374, Chm: 376, Brown: 402, Wood: 471 }, discount: 0 },
    { id: 'prod-D29-BM', name: 'D29', productType: 'Deluxe Section', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 196, Chm: 197, Brown: 241, Wood: 246 }, discount: 0 },
    { id: 'prod-KT1-BM', name: 'KT1', productType: 'Kitchen Series', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 201, Chm: 202, Brown: 251, Wood: 252 }, discount: 0 },
    { id: 'prod-DC26B-PBM', name: 'DC26B', productType: 'Box Section', brand: 'PLUS BLUE METAL', unitType: 'FT', prices: { Dull: 555, Chm: 558, Brown: 596, Wood: 697 }, discount: 0 },
    { id: 'prod-DC26F-PBM', name: 'DC26F', productType: 'Box Section', brand: 'PLUS BLUE METAL', unitType: 'FT', prices: { Dull: 621, Chm: 631, Brown: 675, Wood: 779 }, discount: 0 },
    { id: 'prod-M28A-PBM', name: 'M28A', productType: 'Box Section', brand: 'PLUS BLUE METAL', unitType: 'FT', prices: { Dull: 397, Chm: 407, Brown: 417, Wood: 507 }, discount: 0 },
    { id: 'prod-M24A-PBM', name: 'M24A', productType: 'Box Section', brand: 'PLUS BLUE METAL', unitType: 'FT', prices: { Dull: 469, Chm: 475, Brown: 508, Wood: 532 }, discount: 0 },
    { id: 'prod-EF28-BM', name: 'EF28', productType: 'Economy Section', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 181, Chm: 163, Brown: 195, Wood: 209 }, discount: 0 },
    { id: 'prod-BT02-BM', name: 'BT02', productType: 'Kitchen Handle', brand: 'BLUE METAL', unitType: 'FT', prices: { Dull: 314, Chm: 318, Brown: 338, Wood: 393 }, discount: 0 }
];

export const defaultAppSettings = {
    shopName: 'Aluminum Hardware Store',
    shopPhone1: '0319-6845001',
    shopPhone2: '0312-7534418',
    shopAddress: 'Noman Residency, Ghazi Goth, Sch. # 33 Karachi',
    shopEmail: 'info@aluminumhardware.com | Website: www.aluminumhardware.com',
    bankName: 'Bank Name Here',
    accountTitle: 'Account Title Here',
    accountNumber: 'Account Number / IBAN Here',
    salesTaxRate: 0,
    invoiceFontFamily: 'Inter, sans-serif',
    invoiceFontSize: 14,
    invoiceLogoUrl: '',
    invoicePaperSize: 'A4',
    showLogo: true,
    showAddress: true,
    showBank: true,
    invoiceFooterText: 'Thank you for your business!',
    defaultDiscount: 0,
    invoiceTheme: 'light',
    invoiceColumns: 1
};

export const customLabels = {
    'Aluminum Profiles': {
        length: 'Profile Length (ft)',
        nos: 'Pieces',
        cutSize: 'Cut Size (ft)',
        totalFt: 'Total ft.',
        quantity: 'Total ft.',
        priceCategory: 'Color/Price Category',
    },
    'Glass': {
        quantity: 'Area (SQM)',
    },
    'Hardware': {
        quantity: 'Quantity (PCS)',
    },
    'Accessories': {
        quantity: 'Accessory Qty',
    },
    'Sealant': {
        quantity: 'Sealant Qty (Tubes)',
    },
    'Screws': {
        quantity: 'Screw Qty (Boxes)',
    },
    'Panels': {
        quantity: 'Panel Qty (PCS)',
    },
    'PVC': {
        quantity: 'PVC Qty (Rolls)',
    },
    'Other': {
        quantity: 'Quantity',
    }
};

// --- Global Data Variables (mutable) ---
// These will hold the current state of data loaded from localStorage
export let products = [];
export let orderItems = [];
export let invoicesHistory = []; // This array holds the invoice history
export let appSettings = {};

// --- Utility Functions for Local Storage ---

/**
 * Obfuscates a string using Base64 encoding.
 * @param {string} str - The string to obfuscate.
 * @returns {string} The Base64 encoded string.
 */
export const obfuscate = (str) => str ? btoa(encodeURIComponent(str)) : '';

/**
 * De-obfuscates a Base64 encoded string.
 * @param {string} str - The Base64 encoded string.
 * @returns {string} The decoded string.
 */
export const deobfuscate = (str) => str ? decodeURIComponent(atob(str)) : '';

/**
 * Loads all application data from Local Storage.
 * Initializes with default data if no saved data is found.
 */
export function loadAllData() {
    console.log('--- Loading All Data from Local Storage ---'); // Debugging
    try {
        products = JSON.parse(localStorage.getItem('products')) || defaultProductsData;
        console.log('Products loaded. Count:', products.length); // Debugging

        orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
        console.log('Order Items loaded. Count:', orderItems.length); // Debugging

        // Explicitly load invoicesHistory
        const storedInvoices = localStorage.getItem('invoicesHistory');
        if (storedInvoices) {
            invoicesHistory = JSON.parse(storedInvoices);
        } else {
            invoicesHistory = []; // Initialize empty if nothing found
        }
        console.log('Invoices History loaded. Count:', invoicesHistory.length); // Debugging


        const savedSettings = JSON.parse(localStorage.getItem('appSettings'));
        appSettings = { ...defaultAppSettings, ...savedSettings }; // Merge with defaults
        console.log('App Settings loaded:', appSettings); // Debugging
        
        // This is a bit tricky: customer details are read by index.js and saved by index.js.
        // So, we don't return them here, but rather ensure the localStorage functions are available
        // to index.js to load/save them directly.

    } catch (e) {
        console.error("Error loading data from local storage. Resetting to defaults:", e);
        // Reset to defaults if loading fails
        products = defaultProductsData;
        orderItems = [];
        invoicesHistory = [];
        appSettings = { ...defaultAppSettings };
        
        // Persist the reset defaults to prevent continuous error on load
        saveProducts();
        saveOrderItems();
        saveInvoicesHistory();
        saveAppSettings();
    }
}

/**
 * Saves products data to Local Storage.
 */
export function saveProducts() {
    try {
        localStorage.setItem('products', JSON.stringify(products));
        console.log('Products saved to localStorage. Count:', products.length); // Debugging
    } catch (e) {
        console.error('Error saving products to localStorage:', e);
        // Do not use MessageBox here. Let the calling function handle UI messages.
    }
}

/**
 * Saves order items data to Local Storage.
 */
export function saveOrderItems() {
    try {
        localStorage.setItem('orderItems', JSON.stringify(orderItems));
        console.log('Order items saved to localStorage. Count:', orderItems.length); // Debugging
    } catch (e) {
        console.error('Error saving order items to localStorage:', e);
        // Do not use MessageBox here.
    }
}

/**
 * Saves invoices history data to Local Storage.
 */
export function saveInvoicesHistory() {
    try {
        const data = JSON.stringify(invoicesHistory);
        const sizeInBytes = (new TextEncoder().encode(data)).length;
        const warningThreshold = LOCAL_STORAGE_MAX_SIZE * 0.9;

        if (sizeInBytes > LOCAL_STORAGE_MAX_SIZE) {
            console.error('Local storage for invoices is full. Invoice not saved.');
            // Do not use MessageBox here.
            return; // Prevent saving if truly full
        } else if (sizeInBytes > warningThreshold) {
            console.warn('Local storage for invoices is nearly full. Please export and clear old invoices to free up space.');
            // This is a warning, consider if it needs to be displayed via MessageBox in the calling UI layer.
        }
        localStorage.setItem('invoicesHistory', data);
        console.log('Invoices History saved to localStorage. Current size:', sizeInBytes, 'bytes. Count:', invoicesHistory.length); // Debugging
    } catch (e) {
        console.error('Error saving invoices history to localStorage:', e);
        // Do not use MessageBox here.
    }
}

/**
 * Saves application settings to Local Storage.
 */
export function saveAppSettings() {
    try {
        localStorage.setItem('appSettings', JSON.stringify(appSettings));
        console.log('App Settings saved to localStorage.', appSettings); // Debugging
    } catch (e) {
        console.error('Error saving app settings to localStorage:', e);
        // Do not use MessageBox here.
    }
}

/**
 * Saves customer details to Local Storage after obfuscating them.
 * @param {string} name - Customer name.
 * @param {string} contact - Customer contact.
 * @param {string} address - Customer address.
 */
export function saveCustomerDetails(name, contact, address) {
    try {
        localStorage.setItem('customerName', obfuscate(name));
        localStorage.setItem('customerContact', obfuscate(contact));
        localStorage.setItem('customerAddress', obfuscate(address));
        console.log('Customer details saved to localStorage (obfuscated).'); // Debugging
    } catch (e) {
        console.error('Error saving customer details to localStorage:', e);
        // Do not use MessageBox here.
    }
}

/**
 * Saves discount percentage to Local Storage.
 * @param {number} discount - Discount percentage.
 */
export function saveDiscountPercentage(discount) {
    try {
        localStorage.setItem('discountPercentage', discount.toString());
        console.log('Discount percentage saved to localStorage:', discount); // Debugging
    } catch (e) {
        console.error('Error saving discount percentage to localStorage:', e);
        // Do not use MessageBox here.
    }
}
