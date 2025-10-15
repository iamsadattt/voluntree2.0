// NGO Events JavaScript - Matching Voluntree Design Language
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Cache DOM Elements
        // ===========================
        const eventCards = document.querySelectorAll('.event-card');
        const deleteButtons = document.querySelectorAll('.btn-delete');
        const manageBadges = document.querySelectorAll('.pending-badge');
        const certificateButtons = document.querySelectorAll('.btn-certificate');
        const statusBadges = document.querySelectorAll('.event-status');
        const certStatusBoxes = document.querySelectorAll('.certificate-status-box');
        const eventImages = document.querySelectorAll('.event-image');

        // ===========================
        // Event Card Animations
        // ===========================
        function setupCardAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });

            eventCards.forEach(card => {
                observer.observe(card);
            });
        }

        // ===========================
        // Delete Confirmation Enhancement
        // ===========================
        deleteButtons.forEach(button => {
            const form = button.closest('form');

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const eventTitle = this.closest('.event-card').querySelector('.event-title').textContent;
                const confirmed = confirm(`Are you sure you want to delete "${eventTitle}"?\n\nThis will:\n• Delete the event permanently\n• Remove all volunteer registrations\n• Cannot be undone\n\nClick OK to proceed.`);

                if (confirmed) {
                    button.classList.add('loading');
                    button.disabled = true;

                    const card = button.closest('.event-card');
                    card.classList.add('loading');

                    showNotification('Deleting event...', 'info');

                    this.submit();
                }
            });
        });

        // ===========================
        // Pending Badge Pulse Effect
        // ===========================
        manageBadges.forEach(badge => {
            const count = parseInt(badge.textContent);

            if (count > 0) {
                badge.style.animation = 'pendingPulse 2s ease-in-out infinite';

                badge.addEventListener('mouseenter', function() {
                    showTooltip(this, `${count} volunteer${count > 1 ? 's' : ''} waiting for approval`);
                });

                badge.addEventListener('mouseleave', function() {
                    hideTooltip(this);
                });
            }
        });

        // ===========================
        // Certificate Button Enhancement
        // ===========================
        certificateButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                createRipple(e, this);

                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });

        // ===========================
        // Status Badge Tooltips
        // ===========================
        statusBadges.forEach(badge => {
            badge.addEventListener('mouseenter', function() {
                const message = getStatusMessage(this);
                showTooltip(this, message);
            });

            badge.addEventListener('mouseleave', function() {
                hideTooltip(this);
            });
        });

        function getStatusMessage(badge) {
            if (badge.classList.contains('status-open')) {
                return 'Event is open for registrations';
            } else if (badge.classList.contains('status-closed')) {
                return 'Event is closed for new registrations';
            } else if (badge.classList.contains('status-completed')) {
                return 'Event has been completed';
            }
            return '';
        }

        // ===========================
        // Certificate Status Box Enhancement
        // ===========================
        certStatusBoxes.forEach(box => {
            const certStatus = box.querySelector('.cert-status');

            if (certStatus.classList.contains('cert-pending')) {
                box.style.animation = 'certPulse 2s ease-in-out infinite';
            }

            box.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
            });

            box.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // ===========================
        // Image Error Handling
        // ===========================
        eventImages.forEach(img => {
            img.addEventListener('error', function() {
                const placeholder = document.createElement('div');
                placeholder.className = 'event-image-placeholder';
                placeholder.textContent = '📅';
                this.parentNode.replaceChild(placeholder, this);
            });

            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        });

        // ===========================
        // Image Modal (Click to Enlarge)
        // ===========================
        eventImages.forEach(img => {
            img.style.cursor = 'pointer';

            img.addEventListener('click', function(e) {
                e.preventDefault();
                openImageModal(this.src, this.alt);
            });
        });

        function openImageModal(src, alt) {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="image-modal-overlay">
                    <div class="image-modal-content">
                        <img src="${src}" alt="${alt}">
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
                z-index: 10000;
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

            closeBtn.addEventListener('click', () => closeImageModal(modal));
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeImageModal(modal);
            });

            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeImageModal(modal);
                    document.removeEventListener('keydown', escHandler);
                }
            });
        }

        function closeImageModal(modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }

        // ===========================
        // Card Hover Effects
        // ===========================
        eventCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });

            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '';
            });
        });

        // ===========================
        // Quick Stats Display
        // ===========================
        function displayQuickStats() {
            const totalEvents = eventCards.length;
            const openEvents = document.querySelectorAll('.status-open').length;
            const totalPending = Array.from(manageBadges).reduce((sum, badge) => {
                return sum + parseInt(badge.textContent.match(/\d+/)?.[0] || 0);
            }, 0);

            if (totalEvents > 0) {
                console.log('%c📊 Quick Stats', 'color: #667eea; font-size: 14px; font-weight: bold;');
                console.log(`Total Events: ${totalEvents}`);
                console.log(`Open Events: ${openEvents}`);
                console.log(`Pending Applications: ${totalPending}`);
            }
        }

        // ===========================
        // Auto-refresh Pending Count (Optional)
        // ===========================
        function setupAutoRefresh() {
            // Check if there are pending registrations
            const hasPending = Array.from(manageBadges).some(badge => {
                return parseInt(badge.textContent) > 0;
            });

            if (hasPending) {
                // Show notification about pending registrations
                setTimeout(() => {
                    showNotification(`You have pending volunteer applications to review`, 'info');
                }, 2000);
            }
        }

        // ===========================
        // Smooth Scroll to Top
        // ===========================
        function createScrollToTop() {
            const button = document.createElement('button');
            button.className = 'scroll-to-top';
            button.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 15l-6-6-6 6"/>
                </svg>
            `;
            button.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
                z-index: 1000;
            `;

            document.body.appendChild(button);

            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    button.style.display = 'flex';
                    button.style.animation = 'fadeIn 0.3s ease';
                } else {
                    button.style.display = 'none';
                }
            });

            button.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.1)';
                this.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            });
        }

        // ===========================
        // Keyboard Shortcuts
        // ===========================
        document.addEventListener('keydown', function(e) {
            // Press 'N' to create new event
            if (e.key === 'n' || e.key === 'N') {
                const createBtn = document.querySelector('.btn-create');
                if (createBtn && !e.ctrlKey && !e.metaKey) {
                    const activeElement = document.activeElement;
                    if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                        e.preventDefault();
                        window.location.href = createBtn.href;
                    }
                }
            }
        });

        // ===========================
        // Action Button Enhancements
        // ===========================
        const actionButtons = document.querySelectorAll('.event-actions a, .event-actions button');
        actionButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                if (!this.classList.contains('loading')) {
                    this.style.transform = 'translateY(-2px)';
                }
            });

            button.addEventListener('mouseleave', function() {
                if (!this.classList.contains('loading')) {
                    this.style.transform = '';
                }
            });
        });

        // ===========================
        // Utility Functions
        // ===========================
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;

            const icons = {
                success: '<path d="M20 6L9 17l-5-5"></path>',
                error: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
                info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
            };

            const colors = {
                success: '#10b981',
                error: '#ef4444',
                info: '#667eea'
            };

            notification.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${icons[type]}
                </svg>
                <span>${message}</span>
            `;

            notification.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                background: white;
                color: ${colors[type]};
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                border-left: 4px solid ${colors[type]};
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                font-weight: 500;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }

        function showTooltip(element, message) {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = message;
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
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;

            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.bottom + 8 + 'px';

            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);

            element._tooltip = tooltip;
        }

        function hideTooltip(element) {
            if (element._tooltip) {
                element._tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (element._tooltip) {
                        element._tooltip.remove();
                        element._tooltip = null;
                    }
                }, 300);
            }
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

        // ===========================
        // Certificate Status Notifications
        // ===========================
        function checkCertificateStatuses() {
            const pendingCerts = document.querySelectorAll('.cert-pending');
            const rejectedCerts = document.querySelectorAll('.cert-rejected');

            if (pendingCerts.length > 0) {
                setTimeout(() => {
                    showNotification(`${pendingCerts.length} certificate${pendingCerts.length > 1 ? 's' : ''} pending admin approval`, 'info');
                }, 3000);
            }

            if (rejectedCerts.length > 0) {
                setTimeout(() => {
                    showNotification(`${rejectedCerts.length} certificate${rejectedCerts.length > 1 ? 's were' : ' was'} rejected. Please re-upload.`, 'error');
                }, 4000);
            }
        }

        // ===========================
        // Event Stats Summary
        // ===========================
        function createEventsSummary() {
            if (eventCards.length === 0) return;

            const summary = document.createElement('div');
            summary.className = 'events-summary';

            const totalVolunteers = Array.from(eventCards).reduce((sum, card) => {
                const text = card.querySelector('.meta-item span:last-child')?.textContent || '0 / 0';
                const registered = parseInt(text.split('/')[0].trim()) || 0;
                return sum + registered;
            }, 0);

            const totalPending = Array.from(manageBadges).reduce((sum, badge) => {
                return sum + parseInt(badge.textContent.match(/\d+/)?.[0] || 0);
            }, 0);

            summary.innerHTML = `
                <div class="summary-item">
                    <span class="summary-number">${eventCards.length}</span>
                    <span class="summary-label">Total Events</span>
                </div>
                <div class="summary-item">
                    <span class="summary-number">${totalVolunteers}</span>
                    <span class="summary-label">Total Volunteers</span>
                </div>
                <div class="summary-item">
                    <span class="summary-number">${totalPending}</span>
                    <span class="summary-label">Pending Reviews</span>
                </div>
            `;

            summary.style.cssText = `
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                margin-bottom: 2rem;
                border: 1px solid #e5e7eb;
            `;

            const summaryItems = summary.querySelectorAll('.summary-item');
            summaryItems.forEach(item => {
                item.style.cssText = `
                    text-align: center;
                    padding: 1rem;
                    border-radius: 8px;
                    background: #f9fafb;
                    transition: all 0.3s ease;
                `;
            });

            const summaryNumbers = summary.querySelectorAll('.summary-number');
            summaryNumbers.forEach(num => {
                num.style.cssText = `
                    display: block;
                    font-size: 2rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                `;
            });

            const summaryLabels = summary.querySelectorAll('.summary-label');
            summaryLabels.forEach(label => {
                label.style.cssText = `
                    display: block;
                    color: #6b7280;
                    font-size: 0.875rem;
                    font-weight: 500;
                `;
            });

            const eventsGrid = document.querySelector('.events-grid');
            if (eventsGrid) {
                eventsGrid.parentNode.insertBefore(summary, eventsGrid);
            }
        }

        // ===========================
        // Initialize All Features
        // ===========================
        setupCardAnimations();
        displayQuickStats();
        setupAutoRefresh();
        createScrollToTop();
        checkCertificateStatuses();
        createEventsSummary();

        // ===========================
        // Console Message
        // ===========================
        console.log('%c🏢 NGO Events Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log('%cKeyboard Shortcuts:', 'color: #6b7280; font-size: 12px;');
        console.log('%c  N: Create New Event', 'color: #6b7280; font-size: 11px;');

    });

})();

// ===========================
// Additional CSS Animations
// ===========================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
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

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .notification {
        pointer-events: auto;
    }

    .notification:hover {
        transform: translateX(-5px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
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

    .events-summary .summary-item:hover {
        background: rgba(102, 126, 234, 0.05);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    @media (max-width: 768px) {
        .notification {
            right: 1rem;
            left: 1rem;
            max-width: none;
        }

        .image-modal-close {
            top: 1rem;
            right: 1rem;
        }

        .events-summary {
            grid-template-columns: 1fr !important;
        }
    }

    /* Accessibility */
    .event-actions a:focus-visible,
    .event-actions button:focus-visible {
        outline: 2px solid #667eea;
        outline-offset: 2px;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);