// Admin Panel Base JavaScript - Voluntree Design Language
(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        alertDuration: 5000,
        animationDuration: 300
    };

    // ===== DOM CACHE =====
    const DOM = {
        alerts: null,
        navbar: null,
        navLinks: null
    };

    function cacheDOM() {
        DOM.alerts = document.querySelectorAll('.admin-alert');
        DOM.navbar = document.querySelector('.admin-navbar');
        DOM.navLinks = document.querySelectorAll('.admin-nav-links a');
    }

    // ===== ALERT SYSTEM =====
    const alerts = {
        init() {
            DOM.alerts.forEach(alert => {
                const closeBtn = alert.querySelector('.close-alert');

                if (closeBtn) {
                    closeBtn.addEventListener('click', () => this.close(alert));
                }

                // Auto-close after duration
                setTimeout(() => this.close(alert), CONFIG.alertDuration);
            });
        },

        close(alert) {
            if (!alert) return;

            alert.style.animation = 'slideOut 0.3s ease';

            setTimeout(() => {
                alert.remove();

                // Remove container if no more alerts
                const container = document.querySelector('.admin-messages-container');
                if (container && container.children.length === 0) {
                    container.remove();
                }
            }, CONFIG.animationDuration);
        }
    };

    // ===== NAVIGATION =====
    const navigation = {
        init() {
            // Highlight active page
            this.highlightActive();

            // Mobile menu toggle (if needed in future)
            this.setupMobileMenu();

            // Smooth scroll for anchor links
            this.setupSmoothScroll();
        },

        highlightActive() {
            const currentPath = window.location.pathname;
            DOM.navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });
        },

        setupMobileMenu() {
            // Placeholder for mobile menu functionality
            // Can be expanded if hamburger menu is added
        },

        setupSmoothScroll() {
            DOM.navLinks.forEach(link => {
                if (link.getAttribute('href').startsWith('#')) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const target = document.querySelector(link.getAttribute('href'));
                        if (target) {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    });
                }
            });
        }
    };

    // ===== NAVBAR SCROLL EFFECT =====
    const navbarScroll = {
        init() {
            let lastScroll = 0;

            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 100) {
                    DOM.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                } else {
                    DOM.navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                }

                lastScroll = currentScroll;
            });
        }
    };

    // ===== KEYBOARD SHORTCUTS =====
    const keyboard = {
        init() {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + K for search (if search exists)
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    const searchInput = document.querySelector('input[type="search"], input[name="search"]');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }

                // Escape to close alerts
                if (e.key === 'Escape') {
                    const visibleAlert = document.querySelector('.admin-alert');
                    if (visibleAlert) {
                        alerts.close(visibleAlert);
                    }
                }
            });
        }
    };

    // ===== CONFIRMATION DIALOGS =====
    const confirmations = {
        init() {
            // Add confirmation to logout
            const logoutBtn = document.querySelector('.btn-logout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    if (!confirm('Are you sure you want to logout?')) {
                        e.preventDefault();
                    }
                });
            }

            // Add confirmation to delete buttons (if any)
            document.querySelectorAll('[data-confirm]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const message = btn.dataset.confirm || 'Are you sure?';
                    if (!confirm(message)) {
                        e.preventDefault();
                    }
                });
            });
        }
    };

    // ===== LOADING STATES =====
    const loading = {
        show(element) {
            if (!element) return;

            element.disabled = true;
            element.dataset.originalText = element.textContent;
            element.textContent = 'Loading...';
            element.style.opacity = '0.6';
            element.style.cursor = 'not-allowed';
        },

        hide(element) {
            if (!element) return;

            element.disabled = false;
            element.textContent = element.dataset.originalText || 'Submit';
            element.style.opacity = '1';
            element.style.cursor = 'pointer';
        }
    };

    // ===== TOOLTIPS =====
    const tooltips = {
        init() {
            document.querySelectorAll('[data-tooltip]').forEach(element => {
                element.addEventListener('mouseenter', (e) => {
                    this.show(e.target);
                });

                element.addEventListener('mouseleave', (e) => {
                    this.hide(e.target);
                });
            });
        },

        show(element) {
            const text = element.dataset.tooltip;
            if (!text) return;

            const tooltip = document.createElement('div');
            tooltip.className = 'admin-tooltip';
            tooltip.textContent = text;
            tooltip.style.cssText = `
                position: absolute;
                background: #1f2937;
                color: white;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.875rem;
                white-space: nowrap;
                z-index: 10000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;

            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.style.top = `${rect.bottom + 8}px`;

            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);

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

    // ===== UTILITIES =====
    const utils = {
        // Debounce function
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Format date
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        // Copy to clipboard
        copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.showToast('Copied to clipboard!', 'success');
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            }
        },

        // Show toast notification
        showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `admin-alert admin-alert-${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    };

    // ===== INITIALIZE =====
    function init() {
        cacheDOM();
        alerts.init();
        navigation.init();
        navbarScroll.init();
        keyboard.init();
        confirmations.init();
        tooltips.init();

        console.log('%c⚙️ Admin Panel Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log('%cKeyboard Shortcuts:', 'color: #6b7280; font-size: 12px;');
        console.log('%c  Ctrl/Cmd + K: Focus Search', 'color: #6b7280; font-size: 11px;');
        console.log('%c  Escape: Close Alerts', 'color: #6b7280; font-size: 11px;');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===== EXPOSE UTILITIES =====
    window.AdminUtils = {
        loading,
        utils,
        alerts
    };

})();

// ===== ADDITIONAL CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    /* Loading spinner for buttons */
    .loading::after {
        content: '';
        width: 16px;
        height: 16px;
        margin-left: 0.5rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
        display: inline-block;
        vertical-align: middle;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Ripple effect */
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    /* Tooltip animation */
    .admin-tooltip {
        animation: tooltipFadeIn 0.3s ease;
    }

    @keyframes tooltipFadeIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);