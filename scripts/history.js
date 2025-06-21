// scripts/history.js

import { MessageBox, ConfirmationModal, initMobileNavToggle } from './utils.js';
import { 
    invoicesHistory, appSettings, products, // Include products to resolve item names
    loadAllData, saveInvoicesHistory, deobfuscate, obfuscate 
} from './data.js';

// --- DOM Elements ---
const invoiceHistoryTableBody = document.getElementById('invoice-history-table-body');
const exportInvoicesBtn = document.getElementById('export-invoices-btn');
const clearAllInvoicesBtn = document.getElementById('clear-all-invoices-btn');
const invoiceSearchInput = document.getElementById('invoice-search-input');
const invoiceSearchClearBtn = document.getElementById('invoice-search-clear');

const viewInvoiceModal = document.getElementById('view-invoice-modal');
const modalPrintInvoiceBtn = document.getElementById('modal-print-invoice-btn');
const closeInvoiceModalBtn = document.getElementById('close-invoice-modal-btn');
const invoicePrintAreaSingle = document.getElementById('invoice-print-area-single'); // For single invoice view


// --- Helper Functions ---

/**
 * Populates the invoice print area (within the modal) with the details of a given invoice object.
 * This function is similar to the one in index.js but for history viewing.
 * @param {object} invoice - The invoice object to display.
 */
function displayInvoiceInModal(invoice) {
    const printArea = invoicePrintAreaSingle;
    const selectedInvoiceStyle = appSettings.invoiceStyle || 'default'; // Get style from appSettings
    printArea.innerHTML = generateInvoiceHtml(invoice, selectedInvoiceStyle);

    viewInvoiceModal.classList.remove('hidden');

    // Handle print button inside the modal
    modalPrintInvoiceBtn.onclick = () => {
        document.body.classList.add('print-active'); // Add class to body
        setTimeout(() => {
            window.print(); // Trigger print dialog
        }, 50); 
    };

    closeInvoiceModalBtn.onclick = () => {
        viewInvoiceModal.classList.add('hidden');
        document.body.classList.remove('print-active'); 
    };
}


/**
 * Generates the HTML content for an invoice based on the selected style.
 * This function is duplicated from index.js to ensure consistency for invoice rendering.
 * @param {object} invoice The invoice data.
 * @param {string} style The selected invoice style ('default', 'classic', 'compact').
 * @returns {string} The HTML string for the invoice.
 */
function generateInvoiceHtml(invoice, style) {
    const companyHeaderHtml = `
        ${appSettings.showLogo && appSettings.invoiceLogoUrl ? `<img src="${appSettings.invoiceLogoUrl}" alt="Company Logo" class="mt-2 mx-auto max-h-16 object-contain mb-2" onerror="this.onerror=null;this.src='https://placehold.co/100x50/cccccc/ffffff?text=Logo+Missing';">` : ''}
        <h1 class="text-3xl font-extrabold text-gray-900 mb-1">${appSettings.shopName || 'Aluminum Hardware Store'}</h1>
        <p class="text-sm text-gray-700">
            ${appSettings.shopPhone1 || 'Phone 1 N/A'} ${appSettings.shopPhone2 ? ` | ${appSettings.shopPhone2}` : ''}
        </p>
        ${appSettings.showAddress ? `<p class="text-xs text-gray-600">${appSettings.shopAddress || 'Address N/A'}</p>` : ''}
        <p class="text-xs text-gray-600">${appSettings.shopEmail || ''}</p>
        <h2 class="text-2xl font-bold mt-3 mb-2 text-gray-900">INVOICE</h2>
    `;

    const invoiceDetailsHtml = `
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 mb-2 text-gray-700">
            <p><span class="font-semibold">Invoice ID:</span> ${invoice.id}</p>
            <p><span class="font-semibold">Date:</span> ${invoice.date}</p>
            <p><span class="font-semibold">Customer Name:</span> ${invoice.customer.name || 'N/A'}</p>
            <p><span class="font-semibold">Contact:</span> ${invoice.customer.contact || 'N/A'}</p>
            <p class="col-span-2"><span class="font-semibold">Address:</span> ${invoice.customer.address || 'N/A'}</p>
        </div>
    `;

    const itemTableHeaders = `
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
    `;

    let itemTableRows = '';
    invoice.items.forEach(item => {
        const itemGross = item.unitPrice * item.quantity;
        const itemDiscountAmt = itemGross * (item.discount / 100);
        const itemNet = itemGross - itemDiscountAmt;
        itemTableRows += `
            <tr>
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
            </tr>
        `;
    });

    const totalsHtml = `
        <div class="flex flex-col gap-1 bg-gray-100 p-3 rounded-lg shadow-inner mt-2">
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
    `;

    const bankDetailsHtml = appSettings.showBank ? `
        <div class="mt-4 p-3 bg-gray-100 rounded-lg shadow-inner">
            <h4 class="text-sm font-semibold text-gray-800 mb-1">Bank Details:</h4>
            <p class="text-xs text-gray-700">Bank Name: <span>${appSettings.bankName || 'Bank Name Here'}</span></p>
            <p class="text-xs text-gray-700">Account Title: <span>${appSettings.accountTitle || 'Account Title Here'}</span></p>
            <p class="text-xs text-gray-700">Account Number / IBAN: <span>${appSettings.accountNumber || 'Account Number / IBAN Here'}</span></p>
        </div>` : '';
    
    const footerTextHtml = appSettings.invoiceFooterText ? `<p class="text-center text-xs text-gray-600 mt-2">${appSettings.invoiceFooterText}</p>` : '';

    let invoiceHtml = '';

    switch (style) {
        case 'classic':
            invoiceHtml = `
                <div style="font-family: ${appSettings.invoiceFontFamily}; padding: 20px; border: 1px solid #ccc; max-width: 800px; margin: 0 auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        ${appSettings.showLogo && appSettings.invoiceLogoUrl ? `<img src="${appSettings.invoiceLogoUrl}" alt="Company Logo" style="max-height: 80px; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" onerror="this.onerror=null;this.src='https://placehold.co/100x50/cccccc/ffffff?text=Logo+Missing';">` : ''}
                        <h1 style="font-size: 2.5em; margin: 0;">${appSettings.shopName || 'Aluminum Hardware Store'}</h1>
                        <p style="font-size: 0.9em; margin: 5px 0;">${appSettings.shopPhone1 || 'Phone 1 N/A'} ${appSettings.shopPhone2 ? ` | ${appSettings.shopPhone2}` : ''}</p>
                        ${appSettings.showAddress ? `<p style="font-size: 0.8em; margin: 5px 0;">${appSettings.shopAddress || 'N/A'}</p>` : ''}
                        <p style="font-size: 0.8em; margin: 5px 0;">${appSettings.shopEmail || ''}</p>
                        <h2 style="font-size: 2em; margin-top: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">INVOICE</h2>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 0.9em;">
                        <div>
                            <strong>Invoice ID:</strong> ${invoice.id}<br>
                            <strong>Date:</strong> ${invoice.date}
                        </div>
                        <div style="text-align: right;">
                            <strong>Customer:</strong> ${invoice.customer.name || 'N/A'}<br>
                            <strong>Contact:</strong> ${invoice.customer.contact || 'N/A'}<br>
                            <strong>Address:</strong> ${invoice.customer.address || 'N/A'}
                        </div>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.9em;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Item</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Unit</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Rate</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Qty.</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Net Amt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => {
                                const itemGross = item.unitPrice * item.quantity;
                                const itemDiscountAmt = itemGross * (item.discount / 100);
                                const itemNet = itemGross - itemDiscountAmt;
                                return `
                                <tr>
                                    <td style="border: 1px solid #ccc; padding: 8px;">${item.name} (${item.brand || ''})</td>
                                    <td style="border: 1px solid #ccc; padding: 8px;">${item.unitType || 'N/A'}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${item.unitPrice.toFixed(2)}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${item.nos || item.quantity.toFixed(0)} ${item.length ? `(${item.length.toFixed(2)}ft)` : ''}${item.cutSize ? `(${item.cutSize.toFixed(2)}ft cut)` : ''}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">PKR ${itemNet.toFixed(2)}</td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>

                    <div style="font-size: 0.9em; text-align: right;">
                        <p><strong>Subtotal:</strong> PKR ${invoice.grossTotal.toFixed(2)}</p>
                        <p><strong>Global Discount (${invoice.discountPercent.toFixed(0)}%):</strong> PKR ${invoice.discountAmount.toFixed(2)}</p>
                        <p><strong>Sales Tax (${invoice.salesTaxRate.toFixed(1)}%):</strong> PKR ${invoice.salesTaxAmount.toFixed(2)}</p>
                        <p style="font-size: 1.2em; font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">
                            Grand Total: PKR ${invoice.grandTotal.toFixed(2)}
                        </p>
                    </div>
                    ${bankDetailsHtml ? `<div style="margin-top: 20px; padding-top: 10px; border-top: 1px dashed #ccc; font-size: 0.85em; text-align: center;">
                        <p><strong>Bank Details:</strong></p>
                        <p>Bank Name: ${appSettings.bankName || 'N/A'}</p>
                        <p>Account Title: ${appSettings.accountTitle || 'N/A'}</p>
                        <p>Account Number / IBAN: ${appSettings.accountNumber || 'N/A'}</p>
                    </div>` : ''}
                    ${footerTextHtml ? `<p style="text-align: center; font-size: 0.8em; margin-top: 20px;">${appSettings.invoiceFooterText}</p>` : ''}
                </div>
            `;
            break;

        case 'compact':
            invoiceHtml = `
                <div style="font-family: ${appSettings.invoiceFontFamily}; font-size: 0.8em; padding: 10px; max-width: 600px; margin: 0 auto; line-height: 1.3;">
                    <div style="text-align: center; margin-bottom: 10px;">
                        ${appSettings.showLogo && appSettings.invoiceLogoUrl ? `<img src="${appSettings.invoiceLogoUrl}" alt="Company Logo" style="max-height: 50px; margin-bottom: 5px; display: block; margin-left: auto; margin-right: auto;" onerror="this.onerror=null;this.src='https://placehold.co/100x50/cccccc/ffffff?text=Logo+Missing';">` : ''}
                        <h1 style="font-size: 1.5em; margin: 0;">${appSettings.shopName || 'Aluminum Hardware Store'}</h1>
                        <p>${appSettings.shopPhone1 || 'N/A'}</p>
                        ${appSettings.showAddress ? `<p>${appSettings.shopAddress || 'N/A'}</p>` : ''}
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <div>Inv ID: ${invoice.id}</div>
                        <div>Date: ${invoice.date}</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        Cust: ${invoice.customer.name || 'N/A'} (Contact: ${invoice.customer.contact || 'N/A'})
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                        <thead>
                            <tr>
                                <th style="border-bottom: 1px dashed #ccc; padding: 3px; text-align: left;">Item</th>
                                <th style="border-bottom: 1px dashed #ccc; padding: 3px; text-align: right;">Qty</th>
                                <th style="border-bottom: 1px dashed #ccc; padding: 3px; text-align: right;">Rate</th>
                                <th style="border-bottom: 1px dashed #ccc; padding: 3px; text-align: right;">Net Amt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => {
                                const itemGross = item.unitPrice * item.quantity;
                                const itemDiscountAmt = itemGross * (item.discount / 100);
                                const itemNet = itemGross - itemDiscountAmt;
                                return `
                                <tr>
                                    <td style="padding: 3px; text-align: left;">${item.name}</td>
                                    <td style="padding: 3px; text-align: right;">${item.nos || item.quantity.toFixed(0)}</td>
                                    <td style="padding: 3px; text-align: right;">${item.unitPrice.toFixed(2)}</td>
                                    <td style="padding: 3px; text-align: right;">${itemNet.toFixed(2)}</td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>

                    <div style="text-align: right; margin-top: 10px;">
                        <p>Subtotal: PKR ${invoice.grossTotal.toFixed(2)}</p>
                        <p>Discount: PKR ${invoice.discountAmount.toFixed(2)}</p>
                        <p>Tax: PKR ${invoice.salesTaxAmount.toFixed(2)}</p>
                        <p style="font-size: 1.1em; font-weight: bold; border-top: 1px dashed #ccc; padding-top: 5px; margin-top: 5px;">
                            TOTAL: PKR ${invoice.grandTotal.toFixed(2)}
                        </p>
                    </div>
                    ${bankDetailsHtml ? `<div style="margin-top: 10px; padding-top: 5px; border-top: 1px dashed #ccc; text-align: center;">
                        <p>Bank: ${appSettings.bankName || 'N/A'}</p>
                        <p>A/C: ${appSettings.accountNumber || 'N/A'}</p>
                    </div>` : ''}
                    ${footerTextHtml ? `<p style="text-align: center; margin-top: 10px;">${appSettings.invoiceFooterText}</p>` : ''}
                </div>
            `;
            break;

        case 'default':
        default:
            invoiceHtml = `
                <div class="company-header text-center mb-4 p-2 border border-gray-200 rounded-lg bg-gray-50" style="font-family: ${appSettings.invoiceFontFamily};">
                    ${companyHeaderHtml}
                </div>
                <div class="invoice-details-content text-sm mb-4">
                    ${invoiceDetailsHtml}
                    <div class="overflow-x-auto mb-6">
                        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                            ${itemTableHeaders}
                            <tbody id="invoice-items-modal" class="divide-y divide-gray-200">
                                ${itemTableRows}
                            </tbody>
                        </table>
                    </div>
                    ${totalsHtml}
                    ${bankDetailsHtml}
                    ${footerTextHtml}
                </div>
            `;
            break;
    }

    return invoiceHtml;
}


/**
 * Renders the invoice history table based on the current invoicesHistory data.
 * Applies search filter if active.
 */
function renderInvoiceHistory() {
    const fragment = document.createDocumentFragment();
    invoiceHistoryTableBody.innerHTML = ''; // Clear existing table rows

    const searchTerm = invoiceSearchInput.value.toLowerCase().trim();

    const filteredInvoices = invoicesHistory.filter(invoice => {
        const matchesId = invoice.id.toLowerCase().includes(searchTerm);
        const matchesCustomerName = (invoice.customer.name || '').toLowerCase().includes(searchTerm); // Handle potential undefined customer name
        return matchesId || matchesCustomerName;
    });

    if (filteredInvoices.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="text-center text-gray-500 py-4">No invoices to display.</td>`;
        fragment.appendChild(row);
    } else {
        // Sort invoices by date, newest first
        filteredInvoices.sort((a, b) => new Date(b.date) - new Date(a.date));

        filteredInvoices.forEach((invoice, index) => {
            const statusColorClass = invoice.status === 'Paid' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold';
            const toggleButtonText = invoice.status === 'Paid' ? 'Mark Pending' : 'Mark Paid';
            const toggleButtonClass = invoice.status === 'Paid' ? 'btn-yellow' : 'btn-blue-outline';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-3 px-4">${invoice.id}</td>
                <td class="py-3 px-4">${invoice.date}</td>
                <td class="py-3 px-4">${invoice.customer.name || 'N/A'}</td>
                <td class="py-3 px-4">${invoice.items.length}</td>
                <td class="py-3 px-4">PKR ${invoice.grandTotal.toFixed(2)}</td>
                <td class="py-3 px-4 ${statusColorClass}">${invoice.status || 'N/A'}</td> <!-- Display Status -->
                <td class="py-3 px-4 text-center">
                    <div class="history-actions-buttons"> <!-- New wrapper div -->
                        <button data-invoice-id="${invoice.id}" class="view-invoice-btn btn btn-primary btn-sm" aria-label="View Invoice ${invoice.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button data-invoice-id="${invoice.id}" data-customer-contact="${invoice.customer.contact || ''}" data-grand-total="${invoice.grandTotal.toFixed(2)}" class="whatsapp-customer-btn btn btn-green btn-sm" aria-label="Message Customer via WhatsApp">
                            WhatsApp
                        </button>
                        <button data-invoice-id="${invoice.id}" data-current-status="${invoice.status || 'Pending'}" class="toggle-status-btn btn ${toggleButtonClass} btn-sm" aria-label="Toggle Payment Status">
                            <i class="fas fa-money-bill-wave"></i> ${toggleButtonText}
                        </button>
                        <button data-invoice-id="${invoice.id}" class="delete-invoice-btn btn btn-red btn-sm" aria-label="Delete Invoice ${invoice.id}">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            fragment.appendChild(row);
        });
    }
    invoiceHistoryTableBody.appendChild(fragment);
    addInvoiceActionListeners();
}

/**
 * Adds event listeners to view, delete, WhatsApp, and status toggle invoice buttons.
 */
function addInvoiceActionListeners() {
    document.querySelectorAll('.view-invoice-btn').forEach(button => {
        button.onclick = (event) => {
            const invoiceId = event.currentTarget.dataset.invoiceId;
            const invoice = invoicesHistory.find(inv => inv.id === invoiceId);
            if (invoice) {
                displayInvoiceInModal(invoice);
            } else {
                MessageBox.show('Invoice not found.', 'error');
            }
        };
    });

    document.querySelectorAll('.delete-invoice-btn').forEach(button => {
        button.onclick = (event) => {
            const invoiceId = event.currentTarget.dataset.invoiceId;
            ConfirmationModal.show(`Are you sure you want to delete invoice ID ${invoiceId}? This action cannot be undone.`, (confirmed) => {
                if (confirmed) {
                    deleteInvoice(invoiceId);
                } else {
                    MessageBox.show('Invoice deletion cancelled.', 'info');
                }
            });
        };
    });

    document.querySelectorAll('.whatsapp-customer-btn').forEach(button => {
        button.onclick = (event) => {
            const invoiceId = event.currentTarget.dataset.invoiceId;
            const customerContact = event.currentTarget.dataset.customerContact;
            const grandTotal = event.currentTarget.dataset.grandTotal;
            messageCustomerViaWhatsApp(invoiceId, customerContact, grandTotal);
        };
    });

    document.querySelectorAll('.toggle-status-btn').forEach(button => {
        button.onclick = (event) => {
            const invoiceId = event.currentTarget.dataset.invoiceId;
            toggleInvoiceStatus(invoiceId);
        };
    });
}

/**
 * Deletes an invoice from history.
 * @param {string} invoiceId - The ID of the invoice to delete.
 */
function deleteInvoice(invoiceId) {
    const initialLength = invoicesHistory.length;
    invoicesHistory = invoicesHistory.filter(invoice => invoice.id !== invoiceId);
    if (invoicesHistory.length < initialLength) {
        saveInvoicesHistory();
        renderInvoiceHistory();
        MessageBox.show(`Invoice ID ${invoiceId} deleted successfully.`, 'success');
    } else {
        MessageBox.show('Failed to delete invoice. It might not exist.', 'error');
    }
}

/**
 * Sends a pre-filled WhatsApp message to the customer.
 * @param {string} invoiceId - The ID of the invoice.
 * @param {string} customerContact - The customer's contact number.
 * @param {string} grandTotal - The grand total of the invoice.
 */
function messageCustomerViaWhatsApp(invoiceId, customerContact, grandTotal) {
    if (!customerContact) {
        MessageBox.show('Customer contact number not available for this invoice.', 'error');
        return;
    }

    // Basic cleaning of contact number for WhatsApp (remove non-digits except '+')
    let cleanContact = customerContact.replace(/[^0-9+]/g, '');
    // If it doesn't start with a plus and is a common local number format,
    // you might want to prepend a country code, e.g., '+92' for Pakistan
    if (!cleanContact.startsWith('+') && cleanContact.length === 11 && cleanContact.startsWith('0')) {
        cleanContact = '+92' + cleanContact.substring(1); // Example for Pakistan numbers
    } else if (!cleanContact.startsWith('+') && cleanContact.length === 10) {
        cleanContact = '+92' + cleanContact; // Assuming 10 digits without leading 0 for Pakistan
    }
    // Add more country-specific logic if needed, or leave it general.

    const message = `Dear Customer, your invoice (ID: ${invoiceId}) has a grand total of PKR ${grandTotal}. Please confirm payment. Thank you!`;
    const whatsappUrl = `https://wa.me/${cleanContact}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    MessageBox.show('Opening WhatsApp chat...', 'info');
}

/**
 * Toggles the payment status of an invoice.
 * @param {string} invoiceId - The ID of the invoice to toggle status.
 */
function toggleInvoiceStatus(invoiceId) {
    const invoiceIndex = invoicesHistory.findIndex(inv => inv.id === invoiceId);
    if (invoiceIndex > -1) {
        const currentStatus = invoicesHistory[invoiceIndex].status;
        invoicesHistory[invoiceIndex].status = currentStatus === 'Paid' ? 'Pending' : 'Paid';
        saveInvoicesHistory();
        renderInvoiceHistory(); // Re-render to update the status text and button
        MessageBox.show(`Invoice ID ${invoiceId} status updated to: ${invoicesHistory[invoiceIndex].status}`, 'success');
    } else {
        MessageBox.show('Invoice not found for status update.', 'error');
    }
}


/**
 * Exports all invoices to an Excel file.
 */
function exportInvoices() {
    if (invoicesHistory.length === 0) {
        MessageBox.show('No invoices to export.', 'info');
        return;
    }

    const exportData = [];

    // Define column headers for the Excel sheet
    const headers = [
        'Invoice ID', 'Date', 'Customer Name', 'Customer Contact', 'Customer Address',
        'Invoice Status', // New: Status header
        'Item Brand', 'Item Name', 'Item Unit', 'Item Rate (PKR)', 'Item Size (ft/pcs)',
        'Item Qty', 'Item Gross Amount (PKR)', 'Item Discount (%)', 'Item Discount Amount (PKR)', 'Item Net Amount (PKR)',
        'Invoice Subtotal (PKR)', 
        'Global Discount (%)', 'Global Discount Amount (PKR)',
        'Sales Tax Rate (%)', 'Sales Tax Amount (PKR)', 'Grand Total (PKR)'
    ];
    exportData.push(headers);

    invoicesHistory.forEach(invoice => {
        invoice.items.forEach(item => {
            const row = [];
            // Invoice Details (repeated for each item)
            row.push(invoice.id);
            row.push(invoice.date);
            row.push(invoice.customer.name || 'N/A');
            row.push(invoice.customer.contact || 'N/A');
            row.push(invoice.customer.address || 'N/A');
            row.push(invoice.status || 'N/A'); // New: Invoice Status

            // Item Details
            row.push(item.brand || '');
            row.push(item.name || 'Unknown Item');
            row.push(item.unitType || 'N/A');
            row.push(item.unitPrice ? item.unitPrice.toFixed(2) : '0.00');
            row.push(item.length ? item.length.toFixed(2) + ' ft' : (item.cutSize ? item.cutSize.toFixed(2) + ' ft (cut)' : '-'));
            row.push(item.nos || item.quantity.toFixed(0)); 

            const itemGross = item.unitPrice * item.quantity;
            const itemDiscountAmt = itemGross * (item.discount / 100);
            const itemNet = itemGross - itemDiscountAmt;
            
            row.push(itemGross.toFixed(2));
            row.push(item.discount.toFixed(1));
            row.push(itemDiscountAmt.toFixed(2));
            row.push(itemNet.toFixed(2));

            // Invoice Totals (repeated for each item)
            row.push(invoice.grossTotal.toFixed(2)); 
            row.push(invoice.discountPercent.toFixed(1));
            row.push(invoice.discountAmount.toFixed(2));
            row.push(invoice.salesTaxRate.toFixed(1));
            row.push(invoice.salesTaxAmount.toFixed(2));
            row.push(invoice.grandTotal.toFixed(2));

            exportData.push(row);
        });
    });

    const ws = XLSX.utils.aoa_to_sheet(exportData); 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    XLSX.writeFile(wb, 'invoices_history_export.xlsx');
    MessageBox.show('All invoices exported successfully!', 'success');
}


/**
 * Clears all invoices from history.
 */
function clearAllInvoices() {
    ConfirmationModal.show('Are you sure you want to delete ALL invoices from history? This action cannot be undone.', (confirmed) => {
        if (confirmed) {
            invoicesHistory.length = 0; 
            saveInvoicesHistory();
            renderInvoiceHistory();
            MessageBox.show('All invoices cleared successfully!', 'info');
        } else {
            MessageBox.show('Clearing all invoices cancelled.', 'info');
        }
    });
}


// --- Event Listeners ---
exportInvoicesBtn.addEventListener('click', exportInvoices);
clearAllInvoicesBtn.addEventListener('click', clearAllInvoices);

invoiceSearchInput.addEventListener('input', renderInvoiceHistory); 
invoiceSearchClearBtn.addEventListener('click', () => {
    invoiceSearchInput.value = '';
    renderInvoiceHistory(); 
});

// Event listener for afterprint to clean up body classes (for modal print)
window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-active');
});

// --- Initial Load ---
window.onload = () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    initMobileNavToggle(); 
    loadAllData(); 
    renderInvoiceHistory(); 
};
