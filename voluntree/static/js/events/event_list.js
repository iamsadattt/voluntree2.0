// Event List JavaScript - Matching Voluntree Design Language
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Cache DOM Elements
        // ===========================
        const eventCards = document.querySelectorAll('.event-card');
        const searchInput = document.querySelector('.search-box input');
        const searchButton = document.querySelector('.search-box button');
        const filterSelect = document.querySelector('.filter-select');
        const viewButtons = document.querySelectorAll('.btn-view-event');
        const eventImages = document.querySelectorAll('.event-image');
        const statusBadges = document.querySelectorAll('.event-status');
        const viewNgoButtons = document.querySelectorAll('.btn-view-ngo');

        // ===========================
        // Search Enhancement
        // ===========================
        if (searchInput) {
            // Auto-focus search on page load
            searchInput.focus();

            // Add search icon animation
            searchInput.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
            });

            searchInput.addEventListener('blur', function() {
                this.parentElement.style.transform = '';
            });

            // Clear search on Escape
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    this.value = '';
                    this.blur();
                }
            });

            // Submit on Enter
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchButton.click();
                }
            });

            // Show search suggestions (optional enhancement)
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const query = this.value.trim();

                if (query.length > 0) {
                    this.parentElement.classList.add('has-value');
                } else {
                    this.parentElement.classList.remove('has-value');
                }
            });
        }

        // ===========================
        // Filter Enhancement
        // ===========================
        if (filterSelect) {
            filterSelect.addEventListener('change', function() {
                showNotification('Filtering events...', 'info');
            });

            // Add visual feedback
            filterSelect.addEventListener('focus', function() {
                this.style.transform = 'translateY(-2px)';
            });

            filterSelect.addEventListener('blur', function() {
                this.style.transform = '';
            });
        }

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
        // View Button Enhancement
        // ===========================
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                createRipple(e, this);

                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });


        // ===========================
// View NGO Button Enhancement
// ===========================
viewNgoButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        createRipple(e, this);

        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        // Optional: Show loading notification
        showNotification('Loading NGO profile...', 'info');
    });


    button.addEventListener('mouseleave', function() {
        this.textContent = 'View NGO Profile';
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
            if (badge.classList.contains('status-published') || badge.classList.contains('status-open')) {
                return 'Event is accepting registrations';
            } else if (badge.classList.contains('status-ongoing')) {
                return 'Event is currently in progress';
            } else if (badge.classList.contains('status-completed')) {
                return 'This event has ended';
            } else if (badge.classList.contains('status-closed')) {
                return 'Registration closed';
            }
            return '';
        }

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
        // Spots Left Warning
        // ===========================
        const spotsElements = document.querySelectorAll('.event-spots');
        spotsElements.forEach(element => {
            const text = element.textContent;
            const spotsLeft = parseInt(text);

            if (spotsLeft <= 5 && spotsLeft > 0) {
                element.style.color = '#f59e0b';
                element.style.animation = 'pulse 2s ease-in-out infinite';
            } else if (spotsLeft === 0) {
                element.style.color = '#ef4444';
                element.textContent = 'Full';
            }
        });

        // ===========================
        // Quick Filter Buttons (Future Enhancement)
        // ===========================
        function createQuickFilters() {
            const quickFilters = document.createElement('div');
            quickFilters.className = 'quick-filters';
            quickFilters.innerHTML = `
                <button class="quick-filter active" data-filter="all">All Events</button>
                <button class="quick-filter" data-filter="today">Today</button>
                <button class="quick-filter" data-filter="week">This Week</button>
                <button class="quick-filter" data-filter="month">This Month</button>
            `;

            quickFilters.style.cssText = `
                display: flex;
                gap: 0.75rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            `;

            const quickFilterButtons = quickFilters.querySelectorAll('.quick-filter');
            quickFilterButtons.forEach(btn => {
                btn.style.cssText = `
                    padding: 0.625rem 1.25rem;
                    border: 2px solid #e5e7eb;
                    background: white;
                    border-radius: 20px;
                    color: #6b7280;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;

                btn.addEventListener('click', function() {
                    quickFilterButtons.forEach(b => {
                        b.classList.remove('active');
                        b.style.background = 'white';
                        b.style.color = '#6b7280';
                        b.style.borderColor = '#e5e7eb';
                    });

                    this.classList.add('active');
                    this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    this.style.color = 'white';
                    this.style.borderColor = '#667eea';
                });
            });

            // Insert before events grid
            const eventsGrid = document.querySelector('.events-grid');
            if (eventsGrid) {
                eventsGrid.parentNode.insertBefore(quickFilters, eventsGrid);
            }
        }

        // Uncomment to enable quick filters
        // createQuickFilters();

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
        // Event Count Display
        // ===========================
        function displayEventCount() {
            if (eventCards.length > 0) {
                const countBadge = document.createElement('div');
                countBadge.className = 'event-count-badge';
                countBadge.textContent = `${eventCards.length} Event${eventCards.length !== 1 ? 's' : ''} Found`;
                countBadge.style.cssText = `
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    background: rgba(102, 126, 234, 0.1);
                    color: #667eea;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                `;

                const eventsGrid = document.querySelector('.events-grid');
                if (eventsGrid) {
                    eventsGrid.parentNode.insertBefore(countBadge, eventsGrid);
                }
            }
        }

        // ===========================
        // Keyboard Shortcuts
        // ===========================
        document.addEventListener('keydown', function(e) {
            // Press '/' to focus search
            if (e.key === '/') {
                e.preventDefault();
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // Press 'Escape' to clear search
            if (e.key === 'Escape' && searchInput === document.activeElement) {
                searchInput.value = '';
                searchInput.blur();
            }
        });

        // ===========================
        // Loading State for Search
        // ===========================
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                if (!searchInput.value.trim()) {
                    showNotification('Please enter a search query', 'error');
                    return;
                }

                this.classList.add('loading');
                this.disabled = true;
                this.textContent = 'Searching...';

                // Form will submit naturally, but provide feedback
                showNotification('Searching events...', 'info');
            });
        }

        // ===========================
        // Card Click to View
        // ===========================
        eventCards.forEach(card => {
            const viewBtn = card.querySelector('.btn-view-event');
            const clickableArea = card.querySelector('.event-content');

            if (clickableArea && viewBtn) {
                clickableArea.style.cursor = 'pointer';

                clickableArea.addEventListener('click', function(e) {
                    // Don't trigger if clicking the button directly
                    if (e.target === viewBtn || viewBtn.contains(e.target)) {
                        return;
                    }
                    viewBtn.click();
                });
            }
        });

        // ===========================
        // Lazy Loading Images (Optional)
        // ===========================
        function setupLazyLoading() {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.5s ease';

                        setTimeout(() => {
                            img.style.opacity = '1';
                        }, 100);

                        imageObserver.unobserve(img);
                    }
                });
            });

            eventImages.forEach(img => {
                imageObserver.observe(img);
            });
        }

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
        // Search Query Highlight
        // ===========================
        function highlightSearchQuery() {
            const searchQuery = searchInput?.value.trim().toLowerCase();
            if (!searchQuery) return;

            eventCards.forEach(card => {
                const title = card.querySelector('.event-title');
                const description = card.querySelector('.event-description');

                [title, description].forEach(element => {
                    if (element) {
                        const text = element.textContent;
                        const regex = new RegExp(`(${searchQuery})`, 'gi');

                        if (regex.test(text)) {
                            card.style.animation = 'highlight 1s ease';
                        }
                    }
                });
            });
        }

        // ===========================
        // Stats Summary
        // ===========================
        function displayStats() {
            if (eventCards.length === 0) return;

            const openEvents = document.querySelectorAll('.status-published, .status-open').length;
            const ongoingEvents = document.querySelectorAll('.status-ongoing').length;

            console.log('%c📊 Events Summary', 'color: #667eea; font-size: 14px; font-weight: bold;');
            console.log(`Total Events: ${eventCards.length}`);
            console.log(`Open for Registration: ${openEvents}`);
            console.log(`Ongoing: ${ongoingEvents}`);
        }

        // ===========================
        // Initialize All Features
        // ===========================
        setupCardAnimations();
        createScrollToTop();
        displayEventCount();
        setupLazyLoading();
        highlightSearchQuery();
        displayStats();

        // ===========================
        // Console Message
        // ===========================
        console.log('%c🔍 Event List Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log('%cKeyboard Shortcuts:', 'color: #6b7280; font-size: 12px;');
        console.log('%c  /: Focus Search', 'color: #6b7280; font-size: 11px;');
        console.log('%c  Escape: Clear Search', 'color: #6b7280; font-size: 11px;');

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

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.7;
            transform: scale(1.05);
        }
    }

    @keyframes highlight {
        0%, 100% {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        50% {
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
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

    .search-box.has-value {
        border-color: #667eea;
    }

    .btn-view-event.loading {
        position: relative;
        color: transparent;
    }

    .btn-view-event.loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
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
    }

    /* Accessibility */
    .event-card:focus-within {
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