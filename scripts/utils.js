// scripts/utils.js

/**
 * Utility for showing temporary messages to the user.
 */
export const MessageBox = {
    _box: null,
    _text: null,
    _currentTimeout: null,

    /**
     * Initializes the MessageBox elements. Should be called once on page load.
     */
    init: function() {
        if (!this._box) {
            this._box = document.getElementById('message-box');
            this._text = document.getElementById('message-text');
        }
    },

    /**
     * Shows a message box with a specified message, type, and optional duration.
     * @param {string} message - The message to display.
     * @param {'info'|'success'|'warning'|'error'} type - The type of message (determines styling).
     * @param {number} [duration=2000] - How long the message should be visible in milliseconds. (Changed from 3000ms to 2000ms)
     */
    show: function(message, type = 'info', duration = 2000) { // Default duration changed to 2000ms
        this.init(); // Ensure elements are initialized

        if (!this._box || !this._text) {
            console.error('MessageBox elements not found. Cannot display message.');
            return;
        }

        // Clear any existing timeout to prevent messages from disappearing too soon
        if (this._currentTimeout) {
            clearTimeout(this._currentTimeout);
        }

        // Reset classes
        this._box.classList.remove('hidden', 'bg-blue-100', 'border-blue-400', 'text-blue-700', 
                                    'bg-red-100', 'border-red-400', 'text-red-700', 
                                    'bg-green-100', 'border-green-400', 'text-green-700', 
                                    'bg-yellow-100', 'border-yellow-400', 'text-yellow-700');
        
        // Apply type-specific styling
        switch (type) {
            case 'error':
                this._box.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
                break;
            case 'success':
                this._box.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
                break;
            case 'warning':
                this._box.classList.add('bg-yellow-100', 'border-yellow-400', 'text-yellow-700');
                break;
            case 'info':
            default:
                this._box.classList.add('bg-blue-100', 'border-blue-400', 'text-blue-700');
                break;
        }

        this._text.innerHTML = message; // Set message content
        this._box.classList.remove('hidden'); // Make box visible

        // Set timeout to hide the message
        this._currentTimeout = setTimeout(() => {
            this.hide();
        }, duration);
    },

    /**
     * Hides the message box.
     */
    hide: function() {
        this.init(); // Ensure elements are initialized
        if (this._box) {
            this._box.classList.add('hidden');
        }
        if (this._currentTimeout) {
            clearTimeout(this._currentTimeout);
            this._currentTimeout = null;
        }
    }
};

/**
 * Handles confirmation modals (Yes/No prompts).
 */
export const ConfirmationModal = {
    _modal: null,
    _messageElement: null,
    _yesBtn: null,
    _noBtn: null,
    _callback: null,

    /**
     * Initializes the ConfirmationModal elements. Should be called once.
     */
    init: function() {
        if (!this._modal) {
            this._modal = document.getElementById('confirmation-modal');
            this._messageElement = document.getElementById('confirmation-message');
            this._yesBtn = document.getElementById('confirm-yes-btn');
            this._noBtn = document.getElementById('confirm-no-btn');

            this._yesBtn.addEventListener('click', () => this._handleChoice(true));
            this._noBtn.addEventListener('click', () => this._handleChoice(false));
            // Close modal if background is clicked
            this._modal.addEventListener('click', (event) => {
                if (event.target === this._modal) {
                    this._handleChoice(false); // Treat background click as 'No'
                }
            });
        }
    },

    /**
     * Shows the confirmation modal.
     * @param {string} message - The message to display in the modal.
     * @param {function(boolean): void} callback - A function to call when a choice is made (true for Yes, false for No).
     */
    show: function(message, callback) {
        this.init(); // Ensure elements are initialized
        if (!this._modal || !this._messageElement) {
            console.error('ConfirmationModal elements not found. Cannot display modal.');
            return;
        }

        this._messageElement.textContent = message;
        this._callback = callback;
        this._modal.classList.remove('hidden');
        this._modal.setAttribute('aria-hidden', 'false');
    },

    /**
     * Handles the user's choice (Yes/No) and closes the modal.
     * @param {boolean} choice - True if 'Yes' was clicked, false if 'No'.
     */
    _handleChoice: function(choice) {
        this._modal.classList.add('hidden');
        this._modal.setAttribute('aria-hidden', 'true');
        if (this._callback) {
            this._callback(choice);
            this._callback = null; // Clear callback after use
        }
    }
};

/**
 * Initializes the mobile navigation toggle.
 */
export function initMobileNavToggle() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

    if (mobileMenuButton && mobileNavOverlay) {
        mobileMenuButton.addEventListener('click', () => {
            mobileNavOverlay.classList.toggle('active');
            const isExpanded = mobileNavOverlay.classList.contains('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            if (isExpanded) {
                // Focus on the first link in the overlay for accessibility
                mobileNavOverlay.querySelector('.nav-link')?.focus();
            }
        });

        mobileNavOverlay.addEventListener('click', (event) => {
            // Close overlay if clicked outside nav links (e.g., on the overlay itself)
            // or on a nav link to navigate away
            if (event.target.classList.contains('nav-link') || event.target.classList.contains('mobile-nav-overlay')) {
                mobileNavOverlay.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    } else {
        console.warn('Mobile navigation elements not found. Mobile toggle not initialized.');
    }
}

// Initialize Message Box and Confirmation Modal on load
// This ensures the elements are ready before any 'show' calls are made.
window.addEventListener('DOMContentLoaded', () => {
    MessageBox.init();
    ConfirmationModal.init();
});
