// scripts/products.js

import { MessageBox, ConfirmationModal, initMobileNavToggle } from './utils.js';
import { 
    products, appSettings, defaultProductsData, priceCategories, productTypes,
    loadAllData, saveProducts
} from './data.js';

// --- DOM Elements (Add Product Tab) ---
const addProductForm = document.getElementById('add-product-form');
const productNameInput = document.getElementById('product-name');
const productTypeSelect = document.getElementById('product-type');
const productBrandInput = document.getElementById('product-brand');
const unitTypeInput = document.getElementById('unit-type');
const priceInputsContainer = document.getElementById('price-inputs');
const productDiscountInput = document.getElementById('product-discount');
const clearAddFormBtn = document.getElementById('clear-add-form-btn');

// --- DOM Elements (View Products Tab) ---
const productsTableBody = document.querySelector('#products-table tbody');
const productSearchInput = document.getElementById('product-search');
const searchBtn = document.getElementById('search-btn');
const clearSearchBtn = document.getElementById('clear-search-btn');
const brandFilterSelect = document.getElementById('brand-filter');
const typeFilterSelect = document.getElementById('type-filter');
const exportProductsBtn = document.getElementById('export-products-btn');
const importProductsFile = document.getElementById('import-products-file');

// --- DOM Elements (Edit Product Modal) ---
const editProductModal = document.getElementById('edit-product-modal');
const editProductForm = document.getElementById('edit-product-form');
const editProductIdInput = document.getElementById('edit-product-id');
const editProductNameInput = document.getElementById('edit-product-name');
const editProductTypeSelect = document.getElementById('edit-product-type');
const editProductBrandInput = document.getElementById('edit-product-brand');
const editUnitTypeInput = document.getElementById('edit-unit-type');
const editPriceInputsContainer = document.getElementById('edit-price-inputs');
const editProductDiscountInput = document.getElementById('edit-product-discount');
const cancelEditBtn = document.getElementById('cancel-edit-btn');


// --- Functions ---

/**
 * Populates the product type dropdowns for both add and edit forms.
 */
function populateProductTypeSelects() {
    productTypeSelect.innerHTML = '<option value="">-- Select Type --</option>';
    editProductTypeSelect.innerHTML = '<option value="">-- Select Type --</option>';

    productTypes.forEach(type => {
        const optionAdd = document.createElement('option');
        optionAdd.value = type;
        optionAdd.textContent = type;
        productTypeSelect.appendChild(optionAdd);

        const optionEdit = document.createElement('option');
        optionEdit.value = type;
        optionEdit.textContent = type;
        editProductTypeSelect.appendChild(optionEdit);
    });
}

/**
 * Dynamically creates price input fields based on defined price categories.
 * @param {HTMLElement} container - The container element to append price inputs to.
 * @param {object} currentPrices - An object containing current prices for the product (optional).
 * @param {string} prefix - Prefix for input IDs (e.g., 'product-' or 'edit-product-').
 */
function createPriceInputs(container, currentPrices = {}, prefix = 'product-') {
    container.innerHTML = ''; // Clear existing inputs
    priceCategories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <label for="${prefix}price-${category.toLowerCase()}" class="block text-gray-700 text-sm font-semibold mb-2">${category} Price:</label>
            <input type="number" id="${prefix}price-${category.toLowerCase()}" class="form-group-input" min="0" step="0.01" value="${currentPrices[category] !== undefined ? currentPrices[category] : ''}" placeholder="0.00">
        `;
        container.appendChild(div);
    });
}

/**
 * Loads products from local storage and updates the global products array.
 * If no products are found, it initializes with default data.
 */
function loadProducts() {
    // products and appSettings are already loaded into global variables by loadAllData() from data.js
    // We just ensure loadAllData() is called at the very beginning of window.onload
}

/**
 * Renders the products table with current data, applying search and filters.
 */
function renderProducts() {
    const fragment = document.createDocumentFragment();
    productsTableBody.innerHTML = ''; // Clear existing rows

    const searchTerm = productSearchInput.value.toLowerCase();
    const brandFilter = brandFilterSelect.value;
    const typeFilter = typeFilterSelect.value;

    const filteredProducts = products.filter(product => {
        const matchesSearch = !searchTerm || 
                              product.name.toLowerCase().includes(searchTerm) ||
                              (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
                              (product.productType && product.productType.toLowerCase().includes(searchTerm));
        const matchesBrand = !brandFilter || product.brand === brandFilter;
        const matchesType = !typeFilter || product.productType === typeFilter;
        return matchesSearch && matchesBrand && matchesType;
    });

    if (filteredProducts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="12" class="text-center text-gray-500 py-4">No products found matching criteria.</td>`;
        fragment.appendChild(row);
    } else {
        filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-3 px-4">${product.id}</td>
                <td class="py-3 px-4">${product.name}</td>
                <td class="py-3 px-4">${product.productType || 'N/A'}</td>
                <td class="py-3 px-4">${product.brand || 'N/A'}</td>
                <td class="py-3 px-4">${product.unitType || 'N/A'}</td>
                ${priceCategories.map(cat => `<td class="py-3 px-4">${product.prices && product.prices[cat] !== undefined ? product.prices[cat].toFixed(2) : '-'}</td>`).join('')}
                <td class="py-3 px-4">${product.discount !== undefined ? product.discount.toFixed(1) : '0.0'}%</td>
                <td class="py-3 px-4 text-center no-print">
                    <button data-id="${product.id}" class="edit-product-btn btn btn-yellow btn-sm py-1 px-2 mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button data-id="${product.id}" class="delete-product-btn btn btn-red btn-sm py-1 px-2">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            fragment.appendChild(row);
        });
    }
    productsTableBody.appendChild(fragment);
    addEventListenersToProductActions();
}

/**
 * Adds event listeners to dynamically created edit and delete buttons.
 */
function addEventListenersToProductActions() {
    document.querySelectorAll('.edit-product-btn').forEach(button => {
        button.onclick = (event) => {
            const productId = event.currentTarget.dataset.id;
            editProduct(productId);
        };
    });

    document.querySelectorAll('.delete-product-btn').forEach(button => {
        button.onclick = (event) => {
            const productId = event.currentTarget.dataset.id;
            deleteProduct(productId);
        };
    });
}

/**
 * Populates brand filter dropdown.
 */
function populateBrandFilter() {
    const brandSet = new Set(products.map(p => p.brand).filter(Boolean));
    brandFilterSelect.innerHTML = '<option value="">All Brands</option>';
    brandSet.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilterSelect.appendChild(option);
    });
}

/**
 * Populates type filter dropdown.
 */
function populateTypeFilter() {
    typeFilterSelect.innerHTML = '<option value="">All Types</option>';
    productTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilterSelect.appendChild(option);
    });
}

/**
 * Handles adding a new product.
 */
addProductForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const newProduct = {
        id: `prod-${Date.now().toString().slice(-6)}`, // Simple unique ID
        name: productNameInput.value.trim(),
        productType: productTypeSelect.value,
        brand: productBrandInput.value.trim() || 'N/A',
        unitType: unitTypeInput.value.trim() || 'N/A',
        prices: {},
        discount: parseFloat(productDiscountInput.value) || 0
    };

    let allPricesEntered = true;
    priceCategories.forEach(category => {
        const input = document.getElementById(`product-price-${category.toLowerCase()}`);
        if (input && input.value !== '') {
            const price = parseFloat(input.value);
            if (!isNaN(price) && price >= 0) {
                newProduct.prices[category] = price;
            } else {
                allPricesEntered = false; // Mark as false if any price is invalid/not a number
            }
        }
    });

    if (!newProduct.name || !newProduct.productType) {
        MessageBox.show('Product Name and Type are required.', 'error');
        return;
    }
    if (!allPricesEntered) {
        MessageBox.show('Please ensure all entered prices are valid numbers (non-negative).', 'error');
        return;
    }
    if (Object.keys(newProduct.prices).length === 0) {
         MessageBox.show('At least one price must be entered for the product.', 'error');
        return;
    }

    products.push(newProduct);
    saveProducts(); // Save updated products to local storage
    renderProducts(); // Re-render the table
    MessageBox.show('Product added successfully!', 'success');
    clearAddProductForm(); // Clear the form
    populateBrandFilter(); // Update filters in case a new brand was added
    populateProductSelects(); // Update product type selects
});

/**
 * Clears the "Add New Product" form.
 */
function clearAddProductForm() {
    addProductForm.reset();
    createPriceInputs(priceInputsContainer); // Clear price inputs
}

clearAddFormBtn.onclick = clearAddProductForm;

/**
 * Populates the edit product modal with data of the selected product.
 * @param {string} id - The ID of the product to edit.
 */
function editProduct(id) {
    const productToEdit = products.find(p => p.id === id);
    if (!productToEdit) {
        MessageBox.show('Product not found for editing.', 'error');
        return;
    }

    editProductIdInput.value = productToEdit.id;
    editProductNameInput.value = productToEdit.name;
    editProductTypeSelect.value = productToEdit.productType;
    editProductBrandInput.value = productToEdit.brand;
    editUnitTypeInput.value = productToEdit.unitType;
    editProductDiscountInput.value = productToEdit.discount;

    createPriceInputs(editPriceInputsContainer, productToEdit.prices, 'edit-product-');

    editProductModal.classList.remove('hidden');
}

/**
 * Handles saving changes from the edit product modal.
 */
editProductForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const productId = editProductIdInput.value;
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        MessageBox.show('Product not found for saving changes.', 'error');
        return;
    }

    const updatedProduct = {
        id: productId,
        name: editProductNameInput.value.trim(),
        productType: editProductTypeSelect.value,
        brand: editProductBrandInput.value.trim() || 'N/A',
        unitType: editUnitTypeInput.value.trim() || 'N/A',
        prices: {},
        discount: parseFloat(editProductDiscountInput.value) || 0
    };

    let allPricesValid = true;
    priceCategories.forEach(category => {
        const input = document.getElementById(`edit-product-price-${category.toLowerCase()}`);
        if (input && input.value !== '') {
            const price = parseFloat(input.value);
            if (!isNaN(price) && price >= 0) {
                updatedProduct.prices[category] = price;
            } else {
                allPricesValid = false;
            }
        }
    });

    if (!updatedProduct.name || !updatedProduct.productType) {
        MessageBox.show('Product Name and Type are required.', 'error');
        return;
    }
    if (!allPricesValid) {
        MessageBox.show('Please ensure all entered prices are valid numbers (non-negative).', 'error');
        return;
    }
     if (Object.keys(updatedProduct.prices).length === 0) {
         MessageBox.show('At least one price must be entered for the product.', 'error');
        return;
    }


    products[productIndex] = updatedProduct;
    saveProducts(); // Save updated products to local storage
    renderProducts(); // Re-render the table
    MessageBox.show('Product updated successfully!', 'success');
    editProductModal.classList.add('hidden'); // Hide modal
    populateBrandFilter(); // Update filters in case brand was changed
});

// Cancel Edit
cancelEditBtn.onclick = () => {
    editProductModal.classList.add('hidden');
};

/**
 * Deletes a product after confirmation.
 * @param {string} id - The ID of the product to delete.
 */
function deleteProduct(id) {
    ConfirmationModal.show('Are you sure you want to delete this product?', (confirmed) => {
        if (confirmed) {
            const initialLength = products.length;
            products = products.filter(p => p.id !== id);
            if (products.length < initialLength) {
                saveProducts(); // Save updated products to local storage
                renderProducts(); // Re-render the table
                MessageBox.show('Product deleted successfully!', 'success');
                populateBrandFilter(); // Update filters in case a brand was removed
            } else {
                MessageBox.show('Product not found for deletion.', 'error');
            }
        } else {
            MessageBox.show('Product deletion cancelled.', 'info');
        }
    });
}

// --- Tab Functionality ---
const addProductTabBtn = document.getElementById('add-product-tab');
const viewProductsTabBtn = document.getElementById('view-products-tab');
const addProductContent = document.getElementById('add-product-content');
const viewProductsContent = document.getElementById('view-products-content');

addProductTabBtn.addEventListener('click', () => {
    addProductContent.classList.remove('hidden');
    viewProductsContent.classList.add('hidden');
    addProductTabBtn.classList.add('active-tab-btn');
    viewProductsTabBtn.classList.remove('active-tab-btn');
});

viewProductsTabBtn.addEventListener('click', () => {
    viewProductsContent.classList.remove('hidden');
    addProductContent.classList.add('hidden');
    viewProductsTabBtn.classList.add('active-tab-btn');
    addProductTabBtn.classList.remove('active-tab-btn');
    renderProducts(); // Re-render products when viewing tab is opened
});


// --- Search and Filter Event Listeners ---
searchBtn.addEventListener('click', renderProducts);
productSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        renderProducts();
    }
});
clearSearchBtn.addEventListener('click', () => {
    productSearchInput.value = '';
    renderProducts();
});
brandFilterSelect.addEventListener('change', renderProducts);
typeFilterSelect.addEventListener('change', renderProducts);

// Export products to Excel
exportProductsBtn.onclick = () => {
    const ws = XLSX.utils.json_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'products_export.xlsx');
    MessageBox.show('Products exported successfully!', 'success');
};

// Import products from Excel
importProductsFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const importedProducts = XLSX.utils.sheet_to_json(sheet);
        
        if (Array.isArray(importedProducts) && importedProducts.length > 0) {
            // Validate imported data structure roughly
            const isValid = importedProducts.every(p => 
                p.name && p.productType && p.unitType && typeof p.prices === 'object'
            );

            if (isValid) {
                // Assign new unique IDs to imported products to avoid conflicts
                const productsWithNewIds = importedProducts.map(p => ({
                    ...p,
                    id: `prod-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 5)}`,
                    // Ensure prices are parsed as numbers if they come as strings
                    prices: Object.fromEntries(
                        Object.entries(p.prices || {}).map(([key, value]) => [key, parseFloat(value)])
                    ),
                    discount: parseFloat(p.discount || 0)
                }));
                products.length = 0; // Clear existing products
                products.push(...productsWithNewIds); // Add imported products
                saveProducts();
                renderProducts();
                populateBrandFilter();
                populateProductTypeSelects(); // Update select options if new types/brands imported
                MessageBox.show('Products imported successfully!', 'success');
            } else {
                MessageBox.show('Invalid Excel file format. Please ensure columns like name, productType, unitType, and prices are present and correctly formatted.', 'error');
            }
        } else {
            MessageBox.show('Invalid Excel file format or empty sheet.', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = ''; // Clear the file input for next import
});


// --- Initial Load ---
window.onload = () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    initMobileNavToggle(); // Initialize mobile nav from utils.js
    
    loadAllData(); // Load all data including products and appSettings

    populateProductTypeSelects();
    createPriceInputs(priceInputsContainer); // For add product form
    renderProducts(); // Initial render of products table
    populateBrandFilter();
    populateTypeFilter();

    // Ensure the add tab is active on load
    addProductTabBtn.classList.add('active-tab-btn');
    viewProductsTabBtn.classList.remove('active-tab-btn');
    addProductContent.classList.remove('hidden');
    viewProductsContent.classList.add('hidden');
};
