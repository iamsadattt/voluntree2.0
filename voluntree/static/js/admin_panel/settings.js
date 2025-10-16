// Admin Settings JavaScript - Voluntree Design Language
(function() {
    'use strict';

    // ===== DOM CACHE =====
    const DOM = {
        form: null,
        saveBtn: null,
        resetBtn: null,
        inputs: null,
        checkboxes: null,
        sections: null
    };

    function cacheDOM() {
        DOM.form = document.querySelector('.settings-form');
        DOM.saveBtn = document.querySelector('.btn-save');
        DOM.resetBtn = document.querySelector('.btn-reset');
        DOM.inputs = document.querySelectorAll('.form-control');
        DOM.checkboxes = document.querySelectorAll('input[type="checkbox"]');
        DOM.sections = document.querySelectorAll('.settings-section');
    }

    // ===== FORM VALIDATION =====
    const validation = {
        init() {
            DOM.inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });
        },

        validateField(input) {
            let isValid = true;
            const value = input.value.trim();

            // Remove previous validation
            input.classList.remove('error', 'success');

            // Required fields
            if (input.hasAttribute('required') && !value) {
                isValid = false;
            }

            // Email validation
            if (input.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                }
            }

            // Number validation
            if (input.type === 'number' && value) {
                const min = input.getAttribute('min');
                const max = input.getAttribute('max');
                const numValue = parseFloat(value);

                if (min && numValue < parseFloat(min)) {
                    isValid = false;
                }
                if (max && numValue > parseFloat(max)) {
                    isValid = false;
                }
            }

            // Apply validation class
            if (!isValid) {
                input.classList.add('error');
            } else if (value) {
                input.classList.add('success');
            }

            return isValid;
        },

        validateForm() {
            let isValid = true;

            DOM.inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            return isValid;
        }
    };

    // ===== FORM SUBMISSION =====
    const formHandler = {
        init() {
            if (!DOM.form) return;

            DOM.form.addEventListener('submit', (e) => {
                e.preventDefault();

                if (!validation.validateForm()) {
                    notifications.show('Please fix validation errors', 'error');
                    this.scrollToFirstError();
                    return;
                }

                this.submitForm();
            });
        },

        submitForm() {
            // Show loading state
            DOM.saveBtn.classList.add('loading');
            DOM.saveBtn.disabled = true;

            // Disable all inputs
            DOM.inputs.forEach(input => input.disabled = true);
            DOM.checkboxes.forEach(checkbox => checkbox.disabled = true);

            notifications.show('Saving settings...', 'info');

            // Submit the form
            DOM.form.submit();
        },

        scrollToFirstError() {
            const firstError = document.querySelector('.form-control.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    };

    // ===== RESET FUNCTIONALITY =====
    const resetHandler = {
        init() {
            if (!DOM.resetBtn) return;

            DOM.resetBtn.addEventListener('click', (e) => {
                e.preventDefault();

                if (confirm('Are you sure you want to reset all changes? This will reload the page.')) {
                    window.location.reload();
                }
            });
        }
    };

    // ===== AUTO-SAVE INDICATOR =====
    const autoSave = {
        hasChanges: false,
        initialState: {},

        init() {
            this.captureInitialState();
            this.setupChangeDetection();
            this.setupBeforeUnload();
        },

        captureInitialState() {
            DOM.inputs.forEach(input => {
                this.initialState[input.name] = input.value;
            });

            DOM.checkboxes.forEach(checkbox => {
                this.initialState[checkbox.name] = checkbox.checked;
            });
        },

        setupChangeDetection() {
            DOM.inputs.forEach(input => {
                input.addEventListener('change', () => this.detectChanges());
            });

            DOM.checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => this.detectChanges());
            });
        },

        detectChanges() {
            let hasChanges = false;

            DOM.inputs.forEach(input => {
                if (this.initialState[input.name] !== input.value) {
                    hasChanges = true;
                }
            });

            DOM.checkboxes.forEach(checkbox => {
                if (this.initialState[checkbox.name] !== checkbox.checked) {
                    hasChanges = true;
                }
            });

            this.hasChanges = hasChanges;
            this.updateSaveButton();
        },

        updateSaveButton() {
            if (this.hasChanges) {
                DOM.saveBtn.style.animation = 'pulse 1s ease-in-out infinite';
            } else {
                DOM.saveBtn.style.animation = '';
            }
        },

        setupBeforeUnload() {
            window.addEventListener('beforeunload', (e) => {
                if (this.hasChanges) {
                    e.preventDefault();
                    e.returnValue = '';
                    return '';
                }
            });
        }
    };

    // ===== SECTION COLLAPSE =====
    const sectionCollapse = {
        init() {
            DOM.sections.forEach(section => {
                const title = section.querySelector('.section-title');
                if (title) {
                    title.style.cursor = 'pointer';
                    title.setAttribute('title', 'Click to collapse/expand');

                    title.addEventListener('click', () => {
                        this.toggle(section);
                    });
                }
            });
        },

        toggle(section) {
            const grid = section.querySelector('.settings-grid');
            if (!grid) return;

            const isCollapsed = grid.style.display === 'none';

            if (isCollapsed) {
                grid.style.display = 'grid';
                section.style.paddingBottom = '2rem';
            } else {
                grid.style.display = 'none';
                section.style.paddingBottom = '1rem';
            }
        }
    };

    // ===== KEYBOARD SHORTCUTS =====
    const keyboard = {
        init() {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + S to save
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    e.preventDefault();
                    if (DOM.saveBtn && !DOM.saveBtn.disabled) {
                        DOM.saveBtn.click();
                    }
                }

                // Escape to reset focus
                if (e.key === 'Escape') {
                    document.activeElement?.blur();
                }
            });
        }
    };

    // ===== TOOLTIPS =====
    const tooltips = {
        init() {
            DOM.inputs.forEach(input => {
                const helpText = input.parentElement.querySelector('.form-help');
                if (helpText) {
                    input.addEventListener('focus', () => {
                        this.show(input, helpText.textContent);
                    });

                    input.addEventListener('blur', () => {
                        this.hide(input);
                    });
                }
            });
        },

        show(element, text) {
            if (element._tooltip) return;

            const tooltip = document.createElement('div');
            tooltip.className = 'settings-tooltip';
            tooltip.textContent = text;
            tooltip.style.cssText = `
                position: absolute;
                background: #1f2937;
                color: white;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.875rem;
                z-index: 10000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;

            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left}px`;
            tooltip.style.top = `${rect.bottom + 8}px`;

            setTimeout(() => tooltip.style.opacity = '1', 10);
            element._tooltip = tooltip;
        },

        hide(element) {
            if (element._tooltip) {
                element._tooltip.style.opacity = '0';
                setTimeout(() => {
                    element._tooltip.remove();
                    element._tooltip = null;
                }, 300);
            }
        }
    };

    // ===== NOTIFICATIONS =====
    const notifications = {
        show(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `admin-alert admin-alert-${type}`;
            notification.innerHTML = `
                ${message}
                <button class="close-alert">&times;</button>
            `;

            notification.style.cssText = `
                position: fixed;
                top: 90px;
                right: 2rem;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            `;

            document.body.appendChild(notification);

            const closeBtn = notification.querySelector('.close-alert');
            closeBtn.addEventListener('click', () => {
                this.hide(notification);
            });

            setTimeout(() => this.hide(notification), 5000);
        },

        hide(notification) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    };

    // ===== SEARCH SETTINGS =====
    const search = {
        init() {
            const searchBox = document.createElement('div');
            searchBox.innerHTML = `
                <input type="text" 
                       placeholder="Search settings..." 
                       class="settings-search"
                       style="
                           width: 100%;
                           max-width: 400px;
                           padding: 0.875rem 1rem;
                           border: 2px solid #e5e7eb;
                           border-radius: 8px;
                           font-size: 1rem;
                           margin-bottom: 1.5rem;
                           transition: all 0.3s ease;
                       ">
            `;

            const firstSection = DOM.sections[0];
            if (firstSection) {
                firstSection.parentNode.insertBefore(searchBox, firstSection);
            }

            const searchInput = document.querySelector('.settings-search');
            searchInput.addEventListener('input', (e) => {
                this.filterSettings(e.target.value);
            });

            searchInput.addEventListener('focus', function() {
                this.style.borderColor = '#667eea';
                this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            });

            searchInput.addEventListener('blur', function() {
                this.style.borderColor = '#e5e7eb';
                this.style.boxShadow = '';
            });
        },

        filterSettings(query) {
            const lowerQuery = query.toLowerCase();

            DOM.sections.forEach(section => {
                const title = section.querySelector('.section-title').textContent.toLowerCase();
                const labels = Array.from(section.querySelectorAll('label')).map(l => l.textContent.toLowerCase());
                const helps = Array.from(section.querySelectorAll('.form-help')).map(h => h.textContent.toLowerCase());

                const matches = [title, ...labels, ...helps].some(text => text.includes(lowerQuery));

                if (matches || !query) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }
    };

    // ===== INITIALIZE =====
    function init() {
        cacheDOM();
        validation.init();
        formHandler.init();
        resetHandler.init();
        autoSave.init();
        sectionCollapse.init();
        keyboard.init();
        tooltips.init();
        search.init();

        console.log('%c⚙️ Settings Page Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log('%cKeyboard Shortcuts:', 'color: #6b7280; font-size: 12px;');
        console.log('%c  Ctrl/Cmd + S: Save Settings', 'color: #6b7280; font-size: 11px;');
        console.log('%c  Escape: Clear Focus', 'color: #6b7280; font-size: 11px;');
        console.log('%c  Click section title: Collapse/Expand', 'color: #6b7280; font-size: 11px;');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// ===== ADDITIONAL CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .settings-tooltip {
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .settings-tooltip {
            max-width: 200px;
        }
    }
`;
document.head.appendChild(style);