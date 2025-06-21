// scripts/index.js

import { MessageBox, ConfirmationModal, initMobileNavToggle } from './utils.js';
import { 
    products, orderItems, invoicesHistory, appSettings,
    loadAllData, saveProducts, saveOrderItems, saveInvoicesHistory, saveAppSettings,
    obfuscate, deobfuscate, priceCategories, productTypes, customLabels, LOCAL_STORAGE_MAX_SIZE,
    saveCustomerDetails // Ensure saveCustomerDetails is explicitly imported here
} from './data.js';

// --- DOM Elements ---
const customerNameInput = document.getElementById('customer-name');
const orderDateInput = document.getElementById('order-date');
const customerContactInput = document.getElementById('customer-contact'); // New: Contact input
const customerAddressInput = document.getElementById('customer-address');

const orderProductSelect = document.getElementById('order-product');
const orderPriceCategorySelect = document.getElementById('order-price-category');
const orderQuantityInput = document.getElementById('order-quantity');
const addItemBtn = document.getElementById('add-item-btn');
const clearItemFieldsBtn = document.getElementById('clear-item-fields-btn');

const orderItemsTableBody = document.querySelector('#order-items-table tbody');
const subtotalDisplay = document.getElementById('subtotal-display');
const totalFeetDisplay = document.getElementById('total-feet-display');
const invoiceGlobalDiscountPercentInput = document.getElementById('invoice-global-discount-percent');
const salesTaxRateDisplay = document.getElementById('sales-tax-rate-display');
const salesTaxDisplay = document.getElementById('sales-tax-display');
const grandTotalDisplay = document.getElementById('grand-total-display');

const generateInvoiceBtn = document.getElementById('generate-invoice-btn');
const printCurrentOrderBtn = document.getElementById('print-current-order-btn');
const clearOrderBtn = document.getElementById('clear-order-btn');

const viewInvoiceModal = document.getElementById('view-invoice-modal');
const closeInvoiceModalBtn = document.getElementById('close-invoice-modal-btn');
const modalPrintInvoiceBtn = document.getElementById('modal-print-invoice-btn');
const invoicePrintArea = document.getElementById('invoice-print-area');

const orderBrandFilter = document.getElementById('order-brand-filter');
const orderTypeFilter = document.getElementById('order-type-filter');
const orderProductSearchInput = document.getElementById('order-product-search');
const orderProductSearchBtn = document.getElementById('order-product-search-btn');
const orderProductSearchClear = document.getElementById('order-product-search-clear');

const itemBrandInput = document.getElementById('item-brand');
const itemColorInput = document.getElementById('item-color'); // Assuming 'Color' is a fixed value, not dynamic
const itemUnitDisplay = document.getElementById('item-unit-display');
const itemSizeInput = document.getElementById('item-size'); // Not used, can be removed from HTML if it's meant to be derived.
const orderNosInput = document.getElementById('order-nos');
const orderCutSizeInput = document.getElementById('order-cut-size');
const orderUnitPriceInput = document.getElementById('order-unit-price');
const itemDiscountPercentInput = document.getElementById('item-discount-percent'); // Made editable
const totalItemGrossAmountInput = document.getElementById('total-item-gross-amount');
const totalItemDiscountAmountInput = document.getElementById('total-item-discount-amount');
const totalItemNetAmountInput = document.getElementById('total-item-net-amount');

const orderLengthSelect = document.getElementById('order-length');
const orderLengthOtherInput = document.getElementById('order-length-other');
const orderLengthOtherGroup = document.getElementById('order-length-other-group');


// --- Helper Functions ---

/**
 * Populates the product selection dropdown with current products, applying filters.
 */
function populateProductSelect() {
    const brandFilter = orderBrandFilter.value;
    const typeFilter = orderTypeFilter.value;
    const searchTerm = (orderProductSearchInput.value || '').toLowerCase();

    orderProductSelect.innerHTML = '<option value="">-- Select Product --</option>';
    products.forEach(product => {
        const matchesBrand = !brandFilter || product.brand === brandFilter;
        const matchesType = !typeFilter || product.productType === typeFilter;
        const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm);

        if (matchesBrand && matchesType && matchesSearch) {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.brand ? product.brand + ' - ' : ''}${product.name} (${product.productType || 'N/A'})`;
            orderProductSelect.appendChild(option);
        }
    });
}

/**
 * Populates the brand filter dropdown.
 */
function populateBrandFilter() {
    const brandSet = new Set(products.map(p => p.brand).filter(Boolean));
    orderBrandFilter.innerHTML = '<option value="">All Brands</option>';
    brandSet.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        orderBrandFilter.appendChild(option);
    });
}

/**
 * Populates the type filter dropdown based on the selected brand.
 * If no brand is selected, all product types are shown.
 * @param {string} selectedBrand - The currently selected brand, or empty string for all.
 */
function populateTypeFilter(selectedBrand = '') {
    orderTypeFilter.innerHTML = '<option value="">All Types</option>';
    let typesToShow = new Set();

    if (selectedBrand) {
        // Collect product types relevant to the selected brand
        products.forEach(product => {
            if (product.brand === selectedBrand && product.productType) {
                typesToShow.add(product.productType);
            }
        });
    } else {
        // If no brand selected, show all available product types
        products.forEach(product => {
            if (product.productType) {
                typesToShow.add(product.productType);
            }
        });
    }

    // Sort types alphabetically for consistent display
    const sortedTypes = Array.from(typesToShow).sort();

    sortedTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        orderTypeFilter.appendChild(option);
    });
    // Ensure the current selection in type filter remains valid after update
    // If the previously selected type is no longer available for the new brand, reset it
    if (orderTypeFilter.options[orderTypeFilter.selectedIndex] && !typesToShow.has(orderTypeFilter.value) && orderTypeFilter.value !== "") {
        orderTypeFilter.value = ""; // Reset if current type is not valid for new brand
    }
    populateProductSelect(); // Re-populate products based on new type filter
}


/**
 * Populates the price category dropdown based on the selected product.
 */
function populatePriceCategorySelect(product) {
    orderPriceCategorySelect.innerHTML = '<option value="">-- Select Price Type --</option>';
    if (product && product.prices) {
        priceCategories.forEach(cat => {
            if (product.prices[cat] !== undefined) {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                orderPriceCategorySelect.appendChild(option);
            }
        });
    }
}

/**
 * Updates product details fields based on selected product.
 */
function updateProductDetails() {
    const selectedProduct = products.find(p => p.id === orderProductSelect.value);
    
    itemBrandInput.value = selectedProduct ? selectedProduct.brand || '' : '';
    itemColorInput.value = ''; // Color is not dynamic based on product in provided data
    itemUnitDisplay.value = selectedProduct ? selectedProduct.unitType || '' : '';
    
    // Set default item discount from product, but allow user to override
    itemDiscountPercentInput.value = selectedProduct ? (selectedProduct.discount || 0).toFixed(2) : '0.00';

    populatePriceCategorySelect(selectedProduct);
    updateItemCalculationInputs(); // Recalculate if product changes
}

/**
 * Clears the individual item input fields in the order form.
 */
function clearItemFields() {
    orderProductSelect.value = '';
    orderPriceCategorySelect.value = '';
    orderQuantityInput.value = '1';
    itemBrandInput.value = '';
    itemColorInput.value = '';
    itemUnitDisplay.value = '';
    // itemSizeInput.value = '0.00'; // Not directly used in calculations, can be removed if not needed for display
    orderNosInput.value = '1';
    orderCutSizeInput.value = '0.00';
    orderUnitPriceInput.value = '0.00';
    itemDiscountPercentInput.value = '0.00'; // Clear item specific discount
    totalItemGrossAmountInput.value = '0.00';
    totalItemDiscountAmountInput.value = '0.00';
    totalItemNetAmountInput.value = '0.00';
    orderLengthSelect.value = ''; // Reset length dropdown
    orderLengthOtherInput.value = ''; // Reset custom length input
    orderLengthOtherGroup.classList.add('hidden'); // Hide custom length input

    // Reset display based on no product selected
    updateDynamicOrderFormInputs(null);
}

/**
 * Updates dynamic input fields (labels, visibility) based on selected product type.
 * @param {object|null} selectedProduct - The currently selected product object or null.
 */
function updateDynamicOrderFormInputs(selectedProduct) {
    const lengthGroup = document.getElementById('order-length-group');
    const lengthLabel = lengthGroup.querySelector('label');
    const nosGroup = orderNosInput.parentElement;
    const nosLabel = nosGroup.querySelector('label');
    const cutSizeGroup = orderCutSizeInput.parentElement;
    const cutSizeLabel = cutSizeGroup.querySelector('label');
    const quantityGroup = orderQuantityInput.parentElement;
    const quantityLabel = quantityGroup.querySelector('label');
    const priceCategoryGroup = orderPriceCategorySelect.parentElement;
    const priceCategoryLabel = priceCategoryGroup.querySelector('label');
    
    // Reset defaults first
    lengthGroup.style.display = 'none';
    nosGroup.style.display = 'none';
    cutSizeGroup.style.display = 'none';
    quantityGroup.style.display = '';
    priceCategoryGroup.style.display = '';
    orderQuantityInput.placeholder = 'Enter quantity';
    orderQuantityInput.step = '1';
    orderUnitPriceInput.readOnly = true; // Unit price is always read-only

    if (!selectedProduct) {
        quantityLabel.textContent = 'Quantity:';
        priceCategoryLabel.textContent = 'Select Price Type:';
        return;
    }

    const labels = customLabels[selectedProduct.productType] || {};

    // Set custom labels
    lengthLabel.textContent = labels.length || 'Length:';
    nosLabel.textContent = labels.nos || 'No.s (Pieces):';
    cutSizeLabel.textContent = labels.cutSize || 'Cut Size (ft):';
    quantityLabel.textContent = labels.quantity || 'Quantity:';
    priceCategoryLabel.textContent = labels.priceCategory || 'Price Category:';

    // Toggle visibility based on product type
    if (selectedProduct.productType === 'Aluminum Profiles') {
        lengthGroup.style.display = '';
        nosGroup.style.display = '';
        cutSizeGroup.style.display = '';
        quantityGroup.style.display = 'none'; // Quantity derived from length/nos/cutSize
        priceCategoryGroup.style.display = '';
        orderQuantityInput.step = '0.01'; // Profiles typically use decimal quantities (total ft)
    } else if (selectedProduct.productType === 'Glass') {
        quantityGroup.style.display = '';
        priceCategoryGroup.style.display = 'none'; // Glass usually has one price type (Dull)
        orderQuantityInput.placeholder = labels.quantity || 'Enter area (SQM)';
        orderQuantityInput.step = '0.01';
    } else {
        // Hardware, Accessories, Sealant, Screws, Panels, PVC, Other
        quantityGroup.style.display = '';
        priceCategoryGroup.style.display = 'none'; // These usually have one general price
        orderQuantityInput.placeholder = labels.quantity || 'Enter quantity';
        orderQuantityInput.step = '1';
    }

    // Hide custom length input if not 'other' or if product type isn't Aluminum Profiles
    if (selectedProduct.productType !== 'Aluminum Profiles' || orderLengthSelect.value !== 'other') {
        orderLengthOtherGroup.classList.add('hidden');
        orderLengthOtherInput.value = '';
    }
}

/**
 * Calculates and updates the item's gross amount, discount amount, and net amount.
 */
function updateItemCalculationInputs() {
    const selectedProduct = products.find(p => p.id === orderProductSelect.value);
    if (!selectedProduct) {
        orderUnitPriceInput.value = '0.00';
        totalItemGrossAmountInput.value = '0.00';
        totalItemDiscountAmountInput.value = '0.00';
        totalItemNetAmountInput.value = '0.00';
        return;
    }

    let unitPrice = 0;
    let quantity = 0;
    // Get item discount from the input field (now editable)
    let itemDiscount = parseFloat(itemDiscountPercentInput.value) || 0;

    const selectedPriceCategory = orderPriceCategorySelect.value;
    if (selectedPriceCategory && selectedProduct.prices && selectedProduct.prices[selectedPriceCategory] !== undefined) {
        unitPrice = selectedProduct.prices[selectedPriceCategory];
    } else if (selectedProduct.productType === 'Glass' || selectedProduct.productType === 'Hardware' || selectedProduct.productType === 'Accessories' || selectedProduct.productType === 'Sealant' || selectedProduct.productType === 'Screws' || selectedProduct.productType === 'Panels' || selectedProduct.productType === 'PVC' || selectedProduct.productType === 'Other') {
        // For non-aluminum products, default to 'Dull' price if available or first available price
        unitPrice = selectedProduct.prices['Dull'] || Object.values(selectedProduct.prices)[0] || 0;
    }

    orderUnitPriceInput.value = unitPrice.toFixed(2);

    if (selectedProduct.productType === 'Aluminum Profiles') {
        let length = parseFloat(orderLengthSelect.value);
        if (orderLengthSelect.value === 'other') {
            length = parseFloat(orderLengthOtherInput.value);
        }
        const nos = parseFloat(orderNosInput.value);
        const cutSize = parseFloat(orderCutSizeInput.value);

        if (!isNaN(length) && length > 0 && !isNaN(nos) && nos > 0) {
            quantity = length * nos;
        } else if (!isNaN(cutSize) && cutSize > 0 && !isNaN(nos) && nos > 0) {
            quantity = cutSize * nos;
        } else {
            quantity = 0; // Default if inputs are invalid
        }
        orderQuantityInput.value = quantity.toFixed(2); // Reflect calculated quantity in hidden input
    } else {
        quantity = parseFloat(orderQuantityInput.value) || 0;
    }
    
    const grossAmount = unitPrice * quantity;
    const discountAmount = grossAmount * (itemDiscount / 100);
    const netAmount = grossAmount - discountAmount;

    totalItemGrossAmountInput.value = grossAmount.toFixed(2);
    totalItemDiscountAmountInput.value = discountAmount.toFixed(2);
    totalItemNetAmountInput.value = netAmount.toFixed(2);
}

/**
 * Renders the current order items table and updates total.
 */
function renderOrderItems() {
    const fragment = document.createDocumentFragment();
    let subtotal = 0;
    let totalFeet = 0; // For aluminum profiles

    orderItemsTableBody.innerHTML = ''; // Clear existing table body

    if (orderItems.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="12" class="text-center text-gray-500 py-4">No items added yet.</td>`;
        fragment.appendChild(row);
    } else {
        orderItems.forEach((item, index) => {
            const product = products.find(p => p.id === item.productId) || {};
            const unitPrice = item.unitPrice; // Unit price at the time of adding
            const itemQuantity = item.quantity; // This is the final calculated quantity (total ft or PCS)
            
            const grossAmount = unitPrice * itemQuantity;
            // Use the item's specific discount, not the product's default discount
            const discountPercentageForItem = item.discount !== undefined ? item.discount : 0; 
            const discountAmountForItem = grossAmount * (discountPercentageForItem / 100);
            const netAmount = grossAmount - discountAmountForItem;

            subtotal += netAmount; // Subtotal is sum of net amounts of individual items

            // Calculate total feet only for aluminum profiles
            if (product.productType === 'Aluminum Profiles' && item.unitType === 'FT') {
                totalFeet += itemQuantity; // itemQuantity for profiles is already total feet
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-3 px-4">${item.brand || ''}</td>
                <td class="py-3 px-4">${item.name}</td>
                <td class="py-3 px-4">${item.unitType || ''}</td>
                <td class="py-3 px-4"></td> <!-- Color column, not dynamic in data -->
                <td class="py-3 px-4">PKR ${unitPrice.toFixed(2)}</td>
                <td class="py-3 px-4">${item.length ? item.length.toFixed(2) + ' ft' : (item.cutSize ? item.cutSize.toFixed(2) + ' ft (cut)' : '-')}</td>
                <td class="py-3 px-4">${item.nos || '-'}</td>
                <td class="py-3 px-4">PKR ${grossAmount.toFixed(2)}</td>
                <td class="py-3 px-4">${discountPercentageForItem.toFixed(1)}%</td>
                <td class="py-3 px-4">PKR ${discountAmountForItem.toFixed(2)}</td>
                <td class="py-3 px-4">PKR ${netAmount.toFixed(2)}</td>
                <td class="py-3 px-4 text-center no-print">
                    <button data-index="${index}" class="remove-order-item-btn btn btn-red btn-sm py-1 px-2">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                </td>
            `;
            fragment.appendChild(row);
        });
    }
    orderItemsTableBody.appendChild(fragment); // Append all new rows at once
    subtotalDisplay.textContent = subtotal.toFixed(2);
    totalFeetDisplay.textContent = totalFeet.toFixed(2);
    updateOverallTotals(); // Recalculate grand totals
    addRemoveOrderItemListeners();
}

/**
 * Adds click listeners to remove item buttons in the current order list.
 */
function addRemoveOrderItemListeners() {
    document.querySelectorAll('.remove-order-item-btn').forEach(button => {
        button.onclick = (event) => {
            const indexToRemove = parseInt(event.currentTarget.dataset.index);
            if (indexToRemove > -1 && indexToRemove < orderItems.length) {
                const itemRemoved = orderItems.splice(indexToRemove, 1)[0];
                saveOrderItems();
                renderOrderItems();
                MessageBox.show(`${itemRemoved.name} removed from order.`, 'info');
            }
        };
    });
}

/**
 * Updates the overall totals (subtotal, global discount, sales tax, grand total).
 */
function updateOverallTotals() {
    let currentSubtotal = parseFloat(subtotalDisplay.textContent) || 0;
    const globalDiscountPercent = parseFloat(invoiceGlobalDiscountPercentInput.value) || 0;
    
    let totalAfterGlobalDiscount = currentSubtotal;
    if (!isNaN(globalDiscountPercent) && globalDiscountPercent >= 0 && globalDiscountPercent <= 100) {
        const globalDiscountAmount = currentSubtotal * (globalDiscountPercent / 100);
        totalAfterGlobalDiscount -= globalDiscountAmount;
    } else {
        // Only show error if a value outside 0-100 is explicitly entered, not just default 0.
        if (invoiceGlobalDiscountPercentInput.value.trim() !== '' && (isNaN(globalDiscountPercent) || globalDiscountPercent < 0 || globalDiscountPercent > 100)) {
            MessageBox.show('Invalid global discount percentage. Please enter a number between 0 and 100.', 'error');
            invoiceGlobalDiscountPercentInput.value = '0.00'; // Reset to a valid value
        }
    }

    const salesTaxRate = parseFloat(appSettings.salesTaxRate) || 0;
    salesTaxRateDisplay.textContent = salesTaxRate.toFixed(1);

    let salesTaxAmount = 0;
    if (salesTaxRate > 0) {
        salesTaxAmount = totalAfterGlobalDiscount * (salesTaxRate / 100);
    }
    salesTaxDisplay.textContent = salesTaxAmount.toFixed(2);

    const grandTotal = totalAfterGlobalDiscount + salesTaxAmount;
    grandTotalDisplay.textContent = grandTotal.toFixed(2);

    // Save global discount (which lives on index page)
    localStorage.setItem('invoiceGlobalDiscountPercent', globalDiscountPercent.toString());
}

/**
 * Populates the invoice print area with the details of a given invoice object.
 * @param {object} invoice - The invoice object to display.
 */
function displayInvoiceInModal(invoice) {
    const printArea = invoicePrintArea;
    printArea.innerHTML = ''; // Clear previous content

    // Create company branding and main invoice title section (compacted)
    const companyHeaderDiv = document.createElement('div');
    companyHeaderDiv.className = 'company-header text-center mb-4 p-2 border border-gray-200 rounded-lg bg-gray-50'; // Reduced padding/margin
    companyHeaderDiv.style.fontFamily = appSettings.invoiceFontFamily; // Apply font family
    companyHeaderDiv.innerHTML = `
        ${appSettings.showLogo && appSettings.invoiceLogoUrl ? `<img src="${appSettings.invoiceLogoUrl}" alt="Company Logo" class="mt-2 mx-auto max-h-16 object-contain mb-2" onerror="this.onerror=null;this.src='https://placehold.co/100x50/cccccc/ffffff?text=Logo+Missing';">` : ''}
        <h1 class="text-3xl font-extrabold text-gray-900 mb-1">${appSettings.shopName || 'Aluminum Hardware Store'}</h1> <!-- Reduced font size and margin -->
        <p class="text-sm text-gray-700">
            ${appSettings.shopPhone1 || 'Phone 1 N/A'} ${appSettings.shopPhone2 ? ` | ${appSettings.shopPhone2}` : ''}
        </p>
        ${appSettings.showAddress ? `<p class="text-xs text-gray-600">${appSettings.shopAddress || 'Address N/A'}</p>` : ''}
        <p class="text-xs text-gray-600">${appSettings.shopEmail || ''}</p>
        <h2 class="text-2xl font-bold mt-3 mb-2 text-gray-900">INVOICE</h2> <!-- Main Invoice Title -->
    `;
    printArea.appendChild(companyHeaderDiv);

    // Create invoice details section (Invoice ID, Date, Customer Info)
    const invoiceDetailsDiv = document.createElement('div');
    invoiceDetailsDiv.className = 'invoice-details-content text-sm mb-4'; // Reduced font size for details
    invoiceDetailsDiv.innerHTML = `
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 mb-2 text-gray-700">
            <p><span class="font-semibold">Invoice ID:</span> ${invoice.id}</p>
            <p><span class="font-semibold">Date:</span> ${invoice.date}</p>
            <p><span class="font-semibold">Customer Name:</span> ${invoice.customer.name || 'N/A'}</p>
            <p><span class="font-semibold">Contact:</span> ${invoice.customer.contact || 'N/A'}</p>
            <p class="col-span-2"><span class="font-semibold">Address:</span> ${invoice.customer.address || 'N/A'}</p>
        </div>
        <div class="overflow-x-auto mb-6">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr>
                        <th class="py-2 px-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">Brand</th>
                        <th class="py-2 px-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                        <th class="py-2 px-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit</th>
                        <th class="py-2 px-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rate (PKR)</th>
                        <th class="py-2 px-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Size (ft/pcs)</th>
                        <th class="py-2 px-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty.</th>
                        <th class="py-2 px-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gross Amt (PKR)</th>
                        <th class="py-2 px-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">% Disc.</th>
                        <th class="py-2 px-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Disc. Amt (PKR)</th>
                        <th class="py-2 px-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">Net Amt (PKR)</th>
                    </tr>
                </thead>
                <tbody id="invoice-items-modal" class="divide-y divide-gray-200">
                    <!-- Invoice items will be injected here -->
                </tbody>
            </table>
        </div>
        <div class="flex flex-col gap-1 bg-gray-100 p-3 rounded-lg shadow-inner mt-2"> <!-- Reduced padding/gap -->
            <div class="flex justify-end items-center">
                <span class="text-sm font-bold text-gray-800">Subtotal:</span>
                <span class="text-lg font-extrabold text-blue-600 ml-4">PKR ${invoice.grossTotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-end items-center">
                <span class="text-sm font-bold text-gray-800">Global Discount (${invoice.discountPercent.toFixed(0)}%):</span>
                <span class="text-lg font-extrabold text-red-600 ml-4">PKR ${invoice.discountAmount.toFixed(2)}</span>
            </div>
            <div class="flex justify-end items-center">
                <span class="text-sm font-bold text-gray-800">Sales Tax (${invoice.salesTaxRate.toFixed(1)}%):</span>
                <span class="text-lg font-extrabold text-orange-600 ml-4">PKR ${invoice.salesTaxAmount.toFixed(2)}</span>
            </div>
            <div class="flex justify-end items-center pt-2 border-t border-gray-200 mt-2">
                <span class="text-md font-bold text-gray-800">Grand Total:</span>
                <span class="text-xl font-extrabold text-green-600 ml-4">PKR ${invoice.grandTotal.toFixed(2)}</span>
            </div>
        </div>
        ${appSettings.showBank ? `
        <div class="mt-4 p-3 bg-gray-100 rounded-lg shadow-inner"> <!-- Reduced padding/margin -->
            <h4 class="text-sm font-semibold text-gray-800 mb-1">Bank Details:</h4>
            <p class="text-xs text-gray-700">Bank Name: <span>${appSettings.bankName || 'Bank Name Here'}</span></p>
            <p class="text-xs text-gray-700">Account Title: <span>${appSettings.accountTitle || 'Account Title Here'}</span></p>
            <p class="text-xs text-gray-700">Account Number / IBAN: <span>${appSettings.accountNumber || 'Account Number / IBAN Here'}</span></p>
        </div>` : ''}
        ${appSettings.invoiceFooterText ? `<p class="text-center text-xs text-gray-600 mt-2">${appSettings.invoiceFooterText}</p>` : ''} <!-- Reduced font size and margin -->
    `;
    printArea.appendChild(invoiceDetailsDiv);

    const invoiceItemsBodyModal = printArea.querySelector('#invoice-items-modal');
    invoice.items.forEach(item => {
        const row = invoiceItemsBodyModal.insertRow();
        const itemGross = item.unitPrice * item.quantity;
        const itemDiscountAmt = itemGross * (item.discount / 100);
        const itemNet = itemGross - itemDiscountAmt;
        row.innerHTML = `
            <td class="py-1 px-2 text-xs">${item.brand || ''}</td>
            <td class="py-1 px-2 text-xs">${item.name || 'Unknown Item'}</td>
            <td class="py-1 px-2 text-xs">${item.unitType || 'N/A'}</td>
            <td class="py-1 px-2 text-xs">PKR ${item.unitPrice.toFixed(2)}</td>
            <td class="py-1 px-2 text-xs">${item.length ? item.length.toFixed(2) + ' ft' : (item.cutSize ? item.cutSize.toFixed(2) + ' ft (cut)' : '-')}</td>
            <td class="py-1 px-2 text-xs">${item.nos || item.quantity.toFixed(0)}</td>
            <td class="py-1 px-2 text-xs">PKR ${itemGross.toFixed(2)}</td>
            <td class="py-1 px-2 text-xs">${item.discount.toFixed(1)}%</td>
            <td class="py-1 px-2 text-xs">PKR ${itemDiscountAmt.toFixed(2)}</td>
            <td class="py-1 px-2 text-xs">PKR ${itemNet.toFixed(2)}</td>
        `;
    });

    viewInvoiceModal.classList.remove('hidden');

    // Handle print button inside the modal
    modalPrintInvoiceBtn.onclick = () => {
        console.log('Modal Print button clicked.'); // Debugging
        document.body.classList.add('print-active'); // Add class to body
        console.log('Added print-active class to body. Attempting to print...'); // Debugging
        
        // Using a tiny timeout to ensure the CSS class is applied before print dialog opens
        setTimeout(() => {
            window.print(); // Trigger print dialog
            console.log('window.print() called.'); // Debugging
        }, 50); 
    };

    closeInvoiceModalBtn.onclick = () => {
        viewInvoiceModal.classList.add('hidden');
        // Ensure the print-active class is removed when modal is closed manually
        document.body.classList.remove('print-active'); 
    };
}

/**
 * Applies the current settings to the invoice print area within the modal.
 * This function is mainly for context, as actual styles are handled in global.css and inline.
 * @param {object} settings - The application settings object.
 */
function applySettingsToInvoicePrintAreaModal(settings) {
    // Styles for the print area within the modal are now primarily controlled
    // by global.css @media print rules and inline styles added during HTML generation
    // in displayInvoiceInModal. This function serves as a placeholder for consistency
    // but doesn't directly apply CSS properties here.
}


// --- Event Listeners ---

// Mobile navigation toggle (initialized on window load by utils.js)

// Product selection change: update product details and dynamic form inputs
orderProductSelect.addEventListener('change', () => {
    const selectedProduct = products.find(p => p.id === orderProductSelect.value);
    updateProductDetails();
    updateDynamicOrderFormInputs(selectedProduct);
    updateItemCalculationInputs(); // Recalculate based on product change
});

// Price category change: update unit price and recalculate
orderPriceCategorySelect.addEventListener('change', updateItemCalculationInputs);

// Quantity, Length, Nos, Cut Size changes: recalculate item amounts
orderQuantityInput.addEventListener('input', updateItemCalculationInputs);
orderLengthSelect.addEventListener('change', () => {
    if (orderLengthSelect.value === 'other') {
        orderLengthOtherGroup.classList.remove('hidden');
    } else {
        orderLengthOtherGroup.classList.add('hidden');
        orderLengthOtherInput.value = '';
    }
    updateItemCalculationInputs();
});
orderLengthOtherInput.addEventListener('input', updateItemCalculationInputs);
orderNosInput.addEventListener('input', updateItemCalculationInputs);
orderCutSizeInput.addEventListener('input', updateItemCalculationInputs);

// Add listener for Item Discount (%) input
itemDiscountPercentInput.addEventListener('input', updateItemCalculationInputs);


// Add item to order
addItemBtn.onclick = () => {
    const selectedProductId = orderProductSelect.value;
    const selectedProduct = products.find(p => p.id === selectedProductId);
    let quantity = parseFloat(orderQuantityInput.value) || 0;
    let unitPrice = parseFloat(orderUnitPriceInput.value) || 0;
    let length = null;
    let nos = null;
    let cutSize = null;
    let totalFt = null;
    let priceCategory = orderPriceCategorySelect.value;

    if (!selectedProduct) {
        MessageBox.show('Please select a product.', 'error');
        return;
    }

    if (selectedProduct.productType === 'Aluminum Profiles') {
        length = parseFloat(orderLengthSelect.value);
        if (orderLengthSelect.value === 'other') {
            length = parseFloat(orderLengthOtherInput.value);
        }
        nos = parseInt(orderNosInput.value);
        cutSize = parseFloat(orderCutSizeInput.value);

        let calculatedLength = 0;
        if (!isNaN(cutSize) && cutSize > 0) {
            calculatedLength = cutSize;
        } else if (!isNaN(length) && length > 0) {
            calculatedLength = length;
        }

        if (isNaN(calculatedLength) || calculatedLength <= 0) {
            MessageBox.show('Please select or enter a valid Length or Cut Size for Aluminum Profiles.', 'error');
            return;
        }
        if (isNaN(nos) || nos <= 0) {
            MessageBox.show('Please enter a valid number of pieces (No.s).', 'error');
            return;
        }
        totalFt = calculatedLength * nos;
        quantity = totalFt; // For profiles, quantity is total feet

        if (!priceCategory) {
            MessageBox.show('Please select a price category for this product.', 'error');
            return;
        }
        unitPrice = selectedProduct.prices[priceCategory];
        if (unitPrice === undefined || isNaN(unitPrice)) {
            MessageBox.show('Selected price category is not available for this product.', 'error');
            return;
        }

    } else { // For Glass, Hardware, etc.
        if (isNaN(quantity) || quantity <= 0) {
            MessageBox.show('Please enter a valid quantity.', 'error');
            return;
        }
        // For non-aluminum products, default to 'Dull' price if available or first available
        unitPrice = selectedProduct.prices['Dull'] || Object.values(selectedProduct.prices)[0];
        if (unitPrice === undefined || isNaN(unitPrice)) {
            MessageBox.show('Price not available for this product.', 'error');
            return;
        }
        priceCategory = 'Default'; // Or a relevant default for non-profiles
    }

    const itemDiscount = parseFloat(itemDiscountPercentInput.value) || 0;
    // Validate item discount
    if (isNaN(itemDiscount) || itemDiscount < 0 || itemDiscount > 100) {
        MessageBox.show('Invalid item discount percentage. Please enter a number between 0 and 100.', 'error');
        return;
    }

    orderItems.push({
        id: `order-item-${Date.now()}`, // Unique ID for order item
        productId: selectedProductId,
        name: selectedProduct.name,
        productType: selectedProduct.productType,
        brand: selectedProduct.brand,
        unitType: selectedProduct.unitType,
        unitPrice: unitPrice,
        priceCategory: priceCategory, // Store selected price category
        length: length,
        nos: nos,
        cutSize: cutSize,
        totalFt: totalFt, // Total feet for profiles, null otherwise
        quantity: quantity, // The actual quantity (totalFt or pcs/sqm)
        discount: itemDiscount // Item-specific discount
    });

    saveOrderItems();
    renderOrderItems();
    MessageBox.show(`${selectedProduct.name} added to order.`, 'success');
    clearItemFields();
};

// Clear individual item fields
clearItemFieldsBtn.onclick = clearItemFields;

// Global discount input change
invoiceGlobalDiscountPercentInput.addEventListener('input', updateOverallTotals);

// Generate Invoice
generateInvoiceBtn.onclick = () => {
    console.log('Generate Invoice button clicked. Starting invoice generation process.'); // Debugging
    if (orderItems.length === 0) {
        MessageBox.show('Cannot generate invoice: Order is empty. Add items to order first.', 'error');
        return;
    }
    if (!customerNameInput.value.trim()) {
        MessageBox.show('Please enter customer name before generating invoice.', 'error');
        customerNameInput.focus();
        return;
    }

    // Get contact directly from the new input field
    const customerContact = customerContactInput.value.trim();
    
    const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
    const invoiceDate = orderDateInput.value || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const customerDetails = {
        name: customerNameInput.value.trim(),
        contact: customerContact, 
        address: customerAddressInput.value.trim()
    };
    
    if (typeof saveCustomerDetails === 'function') {
        saveCustomerDetails(customerDetails.name, customerDetails.contact, customerDetails.address); 
        console.log('saveCustomerDetails function called.');
    } else {
        console.error('saveCustomerDetails is not a function. Customer details might not be saved.');
        MessageBox.show('Error: Could not save customer details. Please check console for more info.', 'error');
    }

    let invoiceGrossTotal = 0;
    const invoiceItemsForHistory = [];

    orderItems.forEach(item => {
        const itemGross = item.unitPrice * item.quantity;
        const itemDiscountAmt = itemGross * (item.discount / 100); 
        const itemNet = itemGross - itemDiscountAmt;
        invoiceGrossTotal += itemNet; 

        invoiceItemsForHistory.push(JSON.parse(JSON.stringify({ ...item, grossAmount: itemGross, discountAmount: itemDiscountAmt, netAmount: itemNet })));
    });

    const globalDiscountPercent = parseFloat(invoiceGlobalDiscountPercentInput.value) || appSettings.defaultDiscount || 0;
    const globalDiscountAmount = invoiceGrossTotal * (globalDiscountPercent / 100);
    let invoiceSubtotalAfterDiscount = invoiceGrossTotal - globalDiscountAmount;

    const salesTaxRate = parseFloat(appSettings.salesTaxRate) || 0;
    const salesTaxAmount = invoiceSubtotalAfterDiscount * (salesTaxRate / 100);
    const invoiceGrandTotal = invoiceSubtotalAfterDiscount + salesTaxAmount;

    const newInvoice = {
        id: invoiceId,
        date: invoiceDate,
        customer: customerDetails,
        items: invoiceItemsForHistory,
        grossTotal: invoiceGrossTotal, 
        discountPercent: globalDiscountPercent, 
        discountAmount: globalDiscountAmount, 
        salesTaxRate: salesTaxRate,
        salesTaxAmount: salesTaxAmount,
        grandTotal: invoiceGrandTotal,
        status: 'Pending' // New: Default status for a new invoice
    };

    console.log('Current invoicesHistory length BEFORE push:', invoicesHistory.length); 
    invoicesHistory.push(newInvoice);
    console.log('InvoicesHistory length AFTER push:', invoicesHistory.length); 
    
    saveInvoicesHistory(); 
    
    const savedHistoryRaw = localStorage.getItem('invoicesHistory');
    console.log('InvoicesHistory from localStorage (raw):', savedHistoryRaw); 
    try {
        const savedHistoryParsed = JSON.parse(savedHistoryRaw);
        console.log('InvoicesHistory from localStorage (parsed):', savedHistoryParsed); 
        console.log('Number of invoices in localStorage after save:', savedHistoryParsed.length); 
    } catch (e) {
        console.error('Error parsing invoicesHistory from localStorage AFTER save (potentially corrupted data):', e);
        MessageBox.show('Warning: Could not verify saved invoices from local storage. Data might be corrupted.', 'warning');
    }
    
    displayInvoiceInModal(newInvoice);
    MessageBox.show('Invoice generated and saved to history!', 'success');
    viewInvoiceModal.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Print Current Order
printCurrentOrderBtn.onclick = () => {
    console.log('Print Current Order button clicked. Triggering invoice generation and print...'); 
    if (orderItems.length === 0) {
        MessageBox.show('No current order items to print. Add items to order first.', 'error');
        return;
    }
    generateInvoiceBtn.click(); 
    
    setTimeout(() => {
        const modalPrintButton = document.getElementById('modal-print-invoice-btn');
        if (modalPrintButton) {
            console.log('Found modal print button, clicking it now...'); 
            modalPrintButton.click();
        } else {
            MessageBox.show('Print button not found in modal after generation. Please try again.', 'error');
            console.error('Modal print button not found after timeout. This indicates a rendering or timing issue.'); 
        }
    }, 1000); 
};

// Clear Order
clearOrderBtn.onclick = () => {
    console.log('Clear Order button clicked.');
    ConfirmationModal.show('Are you sure you want to clear the entire order?', (confirmed) => {
        console.log('Confirmation received:', confirmed);
        if (confirmed) {
            console.log('Before clearing: orderItems length =', orderItems.length);
            orderItems.length = 0; // Clear the array
            console.log('After clearing: orderItems length =', orderItems.length);
            saveOrderItems();
            console.log('Order items saved (should be empty).');
            renderOrderItems();
            MessageBox.show('Order cleared successfully!', 'info');
            viewInvoiceModal.classList.add('hidden'); // Also hide the invoice preview if active
            console.log('Invoice modal hidden.');
        } else {
            MessageBox.show('Clear order cancelled.', 'info');
            console.log('Clear order cancelled by user.');
        }
    });
};

// Customer details saving and validation
// Updated to include customerContactInput
customerNameInput.addEventListener('input', () => saveCustomerDetails(customerNameInput.value, customerContactInput.value, customerAddressInput.value));
customerContactInput.addEventListener('input', () => saveCustomerDetails(customerNameInput.value, customerContactInput.value, customerAddressInput.value));
orderDateInput.addEventListener('input', () => {}); 
customerAddressInput.addEventListener('input', () => saveCustomerDetails(customerNameInput.value, customerContactInput.value, customerAddressInput.value));


// Event listeners for search and filters
orderProductSearchBtn.addEventListener('click', populateProductSelect);
orderProductSearchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') populateProductSelect();
});
orderProductSearchClear.addEventListener('click', function() {
    orderProductSearchInput.value = '';
    populateProductSelect();
});

orderBrandFilter.addEventListener('change', () => {
    const selectedBrand = orderBrandFilter.value;
    populateTypeFilter(selectedBrand); // Update product types based on selected brand
});
orderTypeFilter.addEventListener('change', populateProductSelect);

// Event listener for afterprint to clean up body classes
window.addEventListener('afterprint', () => {
    console.log('After print event fired. Removing print-active class from body.'); 
    document.body.classList.remove('print-active');
});

// --- Initial Load and Event Listeners ---
window.onload = () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    initMobileNavToggle(); 

    loadAllData(); 
    
    // Load customer details from localStorage (de-obfuscated) and set form fields
    customerNameInput.value = localStorage.getItem('customerName') ? deobfuscate(localStorage.getItem('customerName')) : '';
    customerContactInput.value = localStorage.getItem('customerContact') ? deobfuscate(localStorage.getItem('customerContact')) : ''; // Load contact
    customerAddressInput.value = localStorage.getItem('customerAddress') ? deobfuscate(localStorage.getItem('customerAddress')) : '';
    
    // Load global discount
    invoiceGlobalDiscountPercentInput.value = parseFloat(localStorage.getItem('invoiceGlobalDiscountPercent')) || appSettings.defaultDiscount || 0;


    populateBrandFilter();
    populateTypeFilter(orderBrandFilter.value); // Initial population based on default brand filter
    populateProductSelect(); 
    renderOrderItems(); 

    // Set today's date as default
    orderDateInput.value = new Date().toISOString().slice(0, 10);

    // Add periodic export reminder (moved logic here, but uses MessageBox from utils)
    let lastExportReminder = parseInt(localStorage.getItem('lastExportReminder')) || 0;
    const EXPORT_REMINDER_INTERVAL = 1000 * 60 * 60 * 24 * 7; // 1 week
    setInterval(() => {
        const now = Date.now();
        if (now - lastExportReminder > EXPORT_REMINDER_INTERVAL) {
            MessageBox.show('Reminder: Please export your data regularly to avoid accidental loss.', 'warning');
            lastExportReminder = now;
            localStorage.setItem('lastExportReminder', lastExportReminder.toString());
        }
    }, 1000 * 60 * 60); 
};
