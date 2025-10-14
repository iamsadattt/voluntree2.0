// NGO Profile JavaScript - Matching Voluntree Design Language
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Cache DOM Elements
        // ===========================
        const profilePicture = document.querySelector('.profile-picture');
        const profilePicturePlaceholder = document.querySelector('.profile-picture-placeholder');
        const statusBadges = document.querySelectorAll('.status-badge');
        const tags = document.querySelectorAll('.tag');
        const actionButtons = document.querySelectorAll('.profile-actions-row a, .btn-edit-profile');
        const contactItems = document.querySelectorAll('.contact-item');
        const detailLinks = document.querySelectorAll('.detail-link');

        // ===========================
        // Profile Picture Enhancement
        // ===========================
        if (profilePicture) {
            profilePicture.addEventListener('load', function() {
                this.style.opacity = '1';
            });

            profilePicture.addEventListener('error', function() {
                if (profilePicturePlaceholder) {
                    this.style.display = 'none';
                    profilePicturePlaceholder.style.display = 'flex';
                }
            });
        }

        // ===========================
        // Status Badge Animation
        // ===========================
        statusBadges.forEach(badge => {
            // Pulse animation for pending status
            if (badge.classList.contains('status-pending')) {
                setInterval(() => {
                    badge.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        badge.style.transform = 'scale(1)';
                    }, 300);
                }, 2000);
            }

            // Add click to copy functionality
            badge.addEventListener('click', function() {
                const status = this.textContent.trim();
                copyToClipboard(status);
                showCopyFeedback(this, 'Status copied!');
            });
        });

        // ===========================
        // Tag Interactions
        // ===========================
        tags.forEach(tag => {
            tag.addEventListener('click', function() {
                // Add pulse animation on click
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);

                // Copy tag text
                const tagText = this.textContent.trim();
                copyToClipboard(tagText);
                showCopyFeedback(this, 'Copied!');
            });

            tag.addEventListener('mouseenter', function() {
                this.style.cursor = 'pointer';
            });
        });

        // ===========================
        // Action Button Enhancements
        // ===========================
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Add ripple effect
                createRipple(e, this);

                // Add loading state
                if (!this.classList.contains('loading')) {
                    this.classList.add('loading');

                    const originalHTML = this.innerHTML;

                    this.innerHTML = `
                        <svg class="loading-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Loading...
                    `;

                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.classList.remove('loading');
                    }, 5000);
                }
            });
        });

        // ===========================
        // Copy Contact Info
        // ===========================
        contactItems.forEach(item => {
            item.addEventListener('click', function() {
                const text = this.querySelector('span').textContent.trim();
                copyToClipboard(text);
                showCopyFeedback(this, 'Copied!');
            });

            item.style.cursor = 'pointer';
        });

        // ===========================
        // External Link Handling
        // ===========================
        detailLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add visual feedback
                this.style.transform = 'translateX(5px)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });

        // ===========================
        // Profile Header Scroll Effect
        // ===========================
        function handleProfileHeaderScroll() {
            const profileHeader = document.querySelector('.profile-header');
            const scrolled = window.pageYOffset > 100;

            if (profileHeader) {
                if (scrolled) {
                    profileHeader.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                } else {
                    profileHeader.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }
            }
        }

        window.addEventListener('scroll', debounce(handleProfileHeaderScroll, 10));

        // ===========================
        // Status Notice Animation
        // ===========================
        const statusNotices = document.querySelectorAll('.status-notice');

        statusNotices.forEach(notice => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'slideIn 0.5s ease';
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(notice);
        });

        // ===========================
        // Info Card Hover Effects
        // ===========================
        const infoCards = document.querySelectorAll('.info-card');

        infoCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // ===========================
        // Detail Item Interactions
        // ===========================
        const detailItems = document.querySelectorAll('.detail-item');

        detailItems.forEach(item => {
            item.addEventListener('click', function() {
                const value = this.querySelector('.detail-value').textContent.trim();

                // Don't copy if it's a link
                if (!this.querySelector('.detail-link')) {
                    copyToClipboard(value);
                    showCopyFeedback(this, 'Copied!');
                }
            });

            if (!item.querySelector('.detail-link')) {
                item.style.cursor = 'pointer';
            }
        });

        // ===========================
        // Utility Functions
        // ===========================
        function copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(err => {
                    console.error('Failed to copy: ', err);
                    fallbackCopyToClipboard(text);
                });
            } else {
                fallbackCopyToClipboard(text);
            }
        }

        function fallbackCopyToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Fallback copy failed: ', err);
            }

            document.body.removeChild(textArea);
        }

        function showCopyFeedback(element, message) {
            const originalContent = element.innerHTML;
            const originalBackground = element.style.background;

            element.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>${message}</span>
            `;

            element.style.background = 'rgba(16, 185, 129, 0.1)';
            element.style.color = '#10b981';

            setTimeout(() => {
                element.innerHTML = originalContent;
                element.style.background = originalBackground;
                element.style.color = '';
            }, 2000);
        }

        function createRipple(event, element) {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            ripple.className = 'ripple-effect';
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // ===========================
        // Responsive Image Handling
        // ===========================
        function handleImageResponsiveness() {
            const images = document.querySelectorAll('.profile-picture');
            images.forEach(img => {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            });
        }

        // ===========================
        // Print Profile Functionality
        // ===========================
        function addPrintButton() {
            const printBtn = document.createElement('button');
            printBtn.className = 'btn-print-profile';
            printBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Print Profile
            `;

            printBtn.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: #6b7280;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s ease;
                margin-left: 1rem;
            `;

            printBtn.addEventListener('mouseenter', function() {
                this.style.background = '#4b5563';
            });

            printBtn.addEventListener('mouseleave', function() {
                this.style.background = '#6b7280';
            });

            printBtn.addEventListener('click', function() {
                window.print();
            });

            const profileActions = document.querySelector('.profile-actions');
            if (profileActions) {
                profileActions.appendChild(printBtn);
            }
        }

        // ===========================
        // Animated Entrance for Cards
        // ===========================
        function animateCardsOnScroll() {
            const cards = document.querySelectorAll('.info-card, .status-notice');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });
        }

        // ===========================
        // Keyboard Navigation
        // ===========================
        function setupKeyboardNavigation() {
            document.addEventListener('keydown', function(e) {
                // Press 'E' to edit profile (if edit button exists)
                if (e.key === 'e' || e.key === 'E') {
                    const editBtn = document.querySelector('.btn-edit-profile');
                    if (editBtn && !e.ctrlKey && !e.metaKey) {
                        const activeElement = document.activeElement;
                        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                            e.preventDefault();
                            editBtn.click();
                        }
                    }
                }

                // Press 'P' to print
                if ((e.key === 'p' || e.key === 'P') && (e.ctrlKey || e.metaKey)) {
                    // Let default print happen
                    return;
                }
            });
        }

        // ===========================
        // Tooltip Enhancement
        // ===========================
        function enhanceTooltips() {
            const elementsWithTooltip = document.querySelectorAll('[data-tooltip]');

            elementsWithTooltip.forEach(element => {
                element.addEventListener('mouseenter', function() {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'custom-tooltip';
                    tooltip.textContent = this.getAttribute('data-tooltip');
                    tooltip.style.cssText = `
                        position: absolute;
                        background: #1f2937;
                        color: white;
                        padding: 0.5rem 0.75rem;
                        border-radius: 6px;
                        font-size: 0.875rem;
                        white-space: nowrap;
                        z-index: 1000;
                        pointer-events: none;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    `;

                    document.body.appendChild(tooltip);

                    const rect = this.getBoundingClientRect();
                    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';

                    setTimeout(() => {
                        tooltip.style.opacity = '1';
                    }, 10);

                    this._tooltip = tooltip;
                });

                element.addEventListener('mouseleave', function() {
                    if (this._tooltip) {
                        this._tooltip.style.opacity = '0';
                        setTimeout(() => {
                            if (this._tooltip) {
                                this._tooltip.remove();
                                this._tooltip = null;
                            }
                        }, 300);
                    }
                });
            });
        }

        // ===========================
        // Status Badge Pulse for Pending
        // ===========================
        function initStatusBadgePulse() {
            const pendingBadge = document.querySelector('.status-pending');

            if (pendingBadge) {
                setInterval(() => {
                    pendingBadge.style.animation = 'pulse 1.5s ease-in-out';
                    setTimeout(() => {
                        pendingBadge.style.animation = '';
                    }, 1500);
                }, 3000);
            }
        }

        // ===========================
        // Organization Logo Click to Enlarge
        // ===========================
        function setupLogoModal() {
            const logo = document.querySelector('.profile-picture');

            if (logo) {
                logo.style.cursor = 'pointer';

                logo.addEventListener('click', function() {
                    const modal = document.createElement('div');
                    modal.className = 'image-modal';
                    modal.innerHTML = `
                        <div class="image-modal-overlay">
                            <div class="image-modal-content">
                                <img src="${this.src}" alt="Organization Logo">
                                <button class="image-modal-close">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `;

                    modal.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 9999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(0, 0, 0, 0.9);
                        backdrop-filter: blur(10px);
                        animation: fadeIn 0.3s ease;
                    `;

                    document.body.appendChild(modal);
                    document.body.style.overflow = 'hidden';

                    const closeBtn = modal.querySelector('.image-modal-close');
                    const overlay = modal.querySelector('.image-modal-overlay');

                    closeBtn.addEventListener('click', () => closeModal(modal));
                    overlay.addEventListener('click', (e) => {
                        if (e.target === overlay) closeModal(modal);
                    });

                    document.addEventListener('keydown', function escHandler(e) {
                        if (e.key === 'Escape') {
                            closeModal(modal);
                            document.removeEventListener('keydown', escHandler);
                        }
                    });
                });
            }
        }

        function closeModal(modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }

        // ===========================
        // Initialize All Features
        // ===========================
        handleImageResponsiveness();
        handleProfileHeaderScroll();
        animateCardsOnScroll();
        setupKeyboardNavigation();
        enhanceTooltips();
        initStatusBadgePulse();
        setupLogoModal();

        // Uncomment to enable print functionality
        // addPrintButton();

        // ===========================
        // Console Message
        // ===========================
        console.log('%c🏢 NGO Profile Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log('%cDesign Language: Voluntree v1.0', 'color: #6b7280; font-size: 12px;');

    });

})();

// ===========================
// Additional CSS Animations
// ===========================
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .image-modal-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        animation: zoomIn 0.3s ease;
    }

    @keyframes zoomIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    .image-modal-content img {
        max-width: 100%;
        max-height: 90vh;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .image-modal-close {
        position: absolute;
        top: -3rem;
        right: 0;
        background: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .image-modal-close:hover {
        background: #ef4444;
        transform: rotate(90deg) scale(1.1);
    }

    .image-modal-close:hover svg {
        color: white;
    }

    .image-modal-close svg {
        color: #1f2937;
        transition: color 0.3s ease;
    }

    @media print {
        .profile-actions,
        .profile-actions-row,
        .btn-print-profile {
            display: none !important;
        }

        .profile-page {
            margin: 0;
            padding: 0;
            background: white;
        }

        .profile-header {
            box-shadow: none;
            border: 1px solid #ddd;
        }

        .info-card {
            box-shadow: none;
            border: 1px solid #ddd;
        }
    }

    @media (max-width: 768px) {
        .image-modal-close {
            top: 1rem;
            right: 1rem;
        }
    }
`;
document.head.appendChild(style);