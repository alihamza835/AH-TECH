// scripts/settings.js

import { MessageBox, initMobileNavToggle } from './utils.js';
import { 
    appSettings, defaultAppSettings, LOCAL_STORAGE_MAX_SIZE,
    loadAllData, saveAppSettings, saveProducts, saveInvoicesHistory
} from './data.js';


// --- DOM Elements ---
const settingsForm = document.getElementById('settings-form');

// Company Details
const shopNameInput = document.getElementById('shop-name');
const shopPhone1Input = document.getElementById('shop-phone1');
const shopPhone2Input = document.getElementById('shop-phone2');
const shopAddressInput = document.getElementById('shop-address');
const shopEmailInput = document.getElementById('shop-email');

// Bank Details
const bankNameInput = document.getElementById('bank-name');
const accountTitleInput = document.getElementById('account-title');
const accountNumberInput = document.getElementById('account-number');

// Invoice Settings
const salesTaxRateInput = document.getElementById('sales-tax-rate');
const invoiceFontFamilyInput = document.getElementById('invoice-font-family');
const invoiceFontSizeInput = document.getElementById('invoice-font-size');
const invoicePaperSizeSelect = document.getElementById('invoice-paper-size');
const invoiceLogoUrlInput = document.getElementById('invoice-logo-url');
const logoPreview = document.getElementById('logo-preview');
const logoPreviewContainer = document.getElementById('logo-preview-container');
const showLogoCheckbox = document.getElementById('show-logo');
const showAddressCheckbox = document.getElementById('show-address');
const showBankCheckbox = document.getElementById('show-bank');
const invoiceFooterTextInput = document.getElementById('invoice-footer-text');
const defaultDiscountInput = document.getElementById('default-discount');
const invoiceColumnsSelect = document.getElementById('invoice-columns');
const darkModeToggle = document.getElementById('dark-mode-toggle');


// --- Functions ---

/**
 * Loads application settings from the global appSettings object (which is populated by data.js).
 * Populates the form fields with these settings.
 */
function loadAppSettingsIntoForm() {
    // appSettings object is already populated by loadAllData() from data.js
    shopNameInput.value = appSettings.shopName || '';
    shopPhone1Input.value = appSettings.shopPhone1 || '';
    shopPhone2Input.value = appSettings.shopPhone2 || '';
    shopAddressInput.value = appSettings.shopAddress || '';
    shopEmailInput.value = appSettings.shopEmail || '';

    bankNameInput.value = appSettings.bankName || '';
    accountTitleInput.value = appSettings.accountTitle || '';
    accountNumberInput.value = appSettings.accountNumber || '';

    salesTaxRateInput.value = appSettings.salesTaxRate !== undefined ? appSettings.salesTaxRate : 0;
    invoiceFontFamilyInput.value = appSettings.invoiceFontFamily || '';
    invoiceFontSizeInput.value = appSettings.invoiceFontSize !== undefined ? appSettings.invoiceFontSize : 14;
    invoicePaperSizeSelect.value = appSettings.invoicePaperSize || 'A4';
    invoiceLogoUrlInput.value = appSettings.invoiceLogoUrl || '';
    showLogoCheckbox.checked = appSettings.showLogo;
    showAddressCheckbox.checked = appSettings.showAddress;
    showBankCheckbox.checked = appSettings.showBank;
    invoiceFooterTextInput.value = appSettings.invoiceFooterText || '';
    defaultDiscountInput.value = appSettings.defaultDiscount !== undefined ? appSettings.defaultDiscount : 0;
    invoiceColumnsSelect.value = appSettings.invoiceColumns !== undefined ? appSettings.invoiceColumns : 1;
    darkModeToggle.checked = appSettings.invoiceTheme === 'dark';

    updateInvoiceLogoPreview();
    applyTheme(appSettings.invoiceTheme); // Apply theme on load
}

/**
 * Updates the invoice logo preview image.
 */
function updateInvoiceLogoPreview() {
    const url = invoiceLogoUrlInput.value;
    if (url) {
        logoPreview.src = url;
        logoPreview.classList.remove('hidden');
        logoPreviewContainer.classList.remove('hidden'); // Show container if URL exists
    } else {
        logoPreview.src = '';
        logoPreview.classList.add('hidden');
        logoPreviewContainer.classList.add('hidden'); // Hide container if no URL
    }
}

/**
 * Applies the selected theme (light/dark) to the document.
 * @param {string} theme - 'light' or 'dark'.
 */
function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark-mode');
        // Example of applying dark mode CSS variables if you were using them:
        // root.style.setProperty('--primary-bg', '#1a202c');
        // root.style.setProperty('--header-bg', '#2d3748');
        // root.style.setProperty('--text-color', '#e2e8f0');
    } else {
        root.classList.remove('dark-mode');
        // Reset to light mode CSS variables
        // root.style.removeProperty('--primary-bg');
        // root.style.removeProperty('--header-bg');
        // root.style.removeProperty('--text-color');
    }
}


// --- Event Listeners ---

// Save Settings
settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const oldSettings = { ...appSettings }; // Clone current settings to compare

    appSettings.shopName = shopNameInput.value.trim();
    appSettings.shopPhone1 = shopPhone1Input.value.trim();
    appSettings.shopPhone2 = shopPhone2Input.value.trim();
    appSettings.shopAddress = shopAddressInput.value.trim();
    appSettings.shopEmail = shopEmailInput.value.trim();

    appSettings.bankName = bankNameInput.value.trim();
    appSettings.accountTitle = accountTitleInput.value.trim();
    appSettings.accountNumber = accountNumberInput.value.trim();

    appSettings.salesTaxRate = parseFloat(salesTaxRateInput.value) || 0;
    appSettings.invoiceFontFamily = invoiceFontFamilyInput.value.trim();
    appSettings.invoiceFontSize = parseInt(invoiceFontSizeInput.value) || 14;
    appSettings.invoicePaperSize = invoicePaperSizeSelect.value;
    appSettings.invoiceLogoUrl = invoiceLogoUrlInput.value.trim();
    appSettings.showLogo = showLogoCheckbox.checked;
    appSettings.showAddress = showAddressCheckbox.checked;
    appSettings.showBank = showBankCheckbox.checked;
    appSettings.invoiceFooterText = invoiceFooterTextInput.value.trim();
    appSettings.defaultDiscount = parseFloat(defaultDiscountInput.value) || 0;
    appSettings.invoiceColumns = parseInt(invoiceColumnsSelect.value) || 1;
    appSettings.invoiceTheme = darkModeToggle.checked ? 'dark' : 'light';

    // Check if any significant changes were made
    const settingsChanged = JSON.stringify(oldSettings) !== JSON.stringify(appSettings);

    if (settingsChanged) {
        saveAppSettings(); // Save updated settings to global appSettings
        applyTheme(appSettings.invoiceTheme); // Apply theme immediately
        MessageBox.show('Settings saved successfully!', 'success');
    } else {
        MessageBox.show('No changes detected in settings.', 'info');
    }
});

// Event listener for logo URL input to update preview dynamically
invoiceLogoUrlInput.addEventListener('input', updateInvoiceLogoPreview);

// Event listener for dark mode toggle to apply theme dynamically
darkModeToggle.addEventListener('change', () => {
    applyTheme(darkModeToggle.checked ? 'dark' : 'light');
});


// --- Initial Load ---
/**
 * Initializes the application when the window loads.
 * Loads data, renders initial UI.
 */
window.onload = () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    initMobileNavToggle(); // Initialize mobile nav from utils.js

    loadAllData(); // Load all data including appSettings
    loadAppSettingsIntoForm(); // Populate form with loaded settings
};
