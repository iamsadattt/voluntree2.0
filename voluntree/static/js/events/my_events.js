// My Events Page JavaScript
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Cache DOM Elements
        // ===========================
        const eventCards = document.querySelectorAll('.event-card');
        const actionButtons = document.querySelectorAll('.event-actions a, .event-actions button');
        const withdrawButtons = document.querySelectorAll('.btn-withdraw');
        const pageHeader = document.querySelector('.page-header');
        const eventsGrid = document.querySelector('.events-grid');
        const noEvents = document.querySelector('.no-events');

        // ===========================
        // Event Card Animations
        // ===========================
        function initializeCardAnimations() {
            eventCards.forEach((card, index) => {
                // Stagger animation
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('fade-in');

                // Add interaction ripple effect
                card.addEventListener('click', function(e) {
                    if (!e.target.closest('a, button')) {
                        // Only create ripple if not clicking a button
                        createRipple(e, this);
                    }
                });
            });
        }

        // ===========================
        // Ripple Effect
        // ===========================
        function createRipple(event, element) {
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            element.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        }

        // ===========================
        // Action Button Handlers
        // ===========================
        actionButtons.forEach(button => {
            if (button.classList.contains('btn-view')) {
                button.addEventListener('click', function(e) {
                    // Add loading state
                    const originalText = this.textContent;
                    this.textContent = '⏳ Loading...';
                    this.style.opacity = '0.7';
                    this.style.pointerEvents = 'none';

                    // Restore after navigation
                    window.addEventListener('beforeunload', function() {
                        button.textContent = originalText;
                        button.style.opacity = '1';
                        button.style.pointerEvents = 'auto';
                    });
                });
            }
        });

        // ===========================
        // Withdraw Confirmation
        // ===========================
        withdrawButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                const eventCard = this.closest('.event-card');
                const eventTitle = eventCard.querySelector('.event-title').textContent;
                const form = this.closest('form');

                // Custom confirmation dialog
                showConfirmDialog(
                    'Withdraw from Event',
                    `Are you sure you want to withdraw from "${eventTitle}"? This action cannot be undone.`,
                    () => {
                        // Add exit animation
                        eventCard.style.animation = 'slideOut 0.3s ease forwards';
                        setTimeout(() => {
                            form.submit();
                        }, 300);
                    }
                );
            });
        });

        // ===========================
        // Custom Confirmation Dialog
        // ===========================
        function showConfirmDialog(title, message, onConfirm) {
            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog';
            dialog.innerHTML = `
                <div class="confirm-overlay"></div>
                <div class="confirm-content">
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="confirm-actions">
                        <button class="btn-confirm-cancel">Cancel</button>
                        <button class="btn-confirm-submit">Confirm</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            const cancelBtn = dialog.querySelector('.btn-confirm-cancel');
            const confirmBtn = dialog.querySelector('.btn-confirm-submit');
            const overlay = dialog.querySelector('.confirm-overlay');

            function closeDialog() {
                dialog.style.animation = 'fadeOut 0.2s ease forwards';
                setTimeout(() => dialog.remove(), 200);
            }

            cancelBtn.addEventListener('click', closeDialog);
            overlay.addEventListener('click', closeDialog);

            confirmBtn.addEventListener('click', () => {
                closeDialog();
                onConfirm();
            });

            // Show dialog
            setTimeout(() => {
                dialog.classList.add('show');
            }, 10);
        }

        // ===========================
        // Status Badge Animation
        // ===========================
        function animateStatusBadges() {
            const statusBadges = document.querySelectorAll('.registration-status');

            statusBadges.forEach((badge, index) => {
                badge.style.animationDelay = `${index * 0.15}s`;

                // Pulse animation on hover
                badge.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                });

                badge.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            });
        }

        // ===========================
        // Event Statistics (Optional)
        // ===========================
        function displayEventStats() {
            if (!eventsGrid) return;

            const eventCount = eventCards.length;
            const approvedCount = document.querySelectorAll('.status-approved').length;
            const pendingCount = document.querySelectorAll('.status-pending').length;

            // Could be displayed in a stats section if added to HTML
            console.log({
                totalEvents: eventCount,
                approved: approvedCount,
                pending: pendingCount,
                other: eventCount - approvedCount - pendingCount
            });
        }

        // ===========================
        // Filter and Search (Future Enhancement)
        // ===========================
        function prepareForFilters() {
            // Add data attributes for filtering
            eventCards.forEach(card => {
                const status = card.querySelector('.registration-status').className;
                const date = card.querySelector('.meta-item span').textContent;

                card.setAttribute('data-status', status);
                card.setAttribute('data-searchable', card.textContent.toLowerCase());
            });
        }

        // ===========================
        // Smooth Scroll to Section
        // ===========================
        function initializeSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        }

        // ===========================
        // Lazy Load Images
        // ===========================
        function initializeLazyLoad() {
            const images = document.querySelectorAll('.event-image');

            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.style.opacity = '0';
                            img.style.transition = 'opacity 0.3s ease';

                            // Trigger image load
                            img.addEventListener('load', () => {
                                img.style.opacity = '1';
                            });

                            observer.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            }
        }

        // ===========================
        // Empty State Animation
        // ===========================
        function animateEmptyState() {
            if (noEvents) {
                const icon = noEvents.querySelector('.no-events-icon');
                if (icon) {
                    icon.style.animation = 'bounce 2s infinite ease-in-out';
                }
            }
        }

        // ===========================
        // Page Header Scroll Effect
        // ===========================
        function handleHeaderScroll() {
            const scrolled = window.pageYOffset > 50;

            if (pageHeader) {
                if (scrolled) {
                    pageHeader.style.transform = 'translateY(-10px)';
                    pageHeader.style.opacity = '0.8';
                } else {
                    pageHeader.style.transform = 'translateY(0)';
                    pageHeader.style.opacity = '1';
                }
            }
        }

        window.addEventListener('scroll', debounce(handleHeaderScroll, 10));

        // ===========================
        // Copy Event Details
        // ===========================
        function enableEventDetailsCopy() {
            eventCards.forEach(card => {
                const copyTrigger = card.querySelector('.event-title');

                if (copyTrigger) {
                    copyTrigger.style.cursor = 'pointer';
                    copyTrigger.addEventListener('click', function(e) {
                        if (e.detail === 3) { // Triple-click
                            const text = this.textContent;
                            navigator.clipboard.writeText(text).then(() => {
                                showToast('Event title copied!');
                            });
                        }
                    });
                }
            });
        }

        // ===========================
        // Toast Notifications
        // ===========================
        function showToast(message, duration = 3000) {
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                z-index: 1000;
                animation: slideUp 0.3s ease;
                font-weight: 500;
                font-size: 0.95rem;
            `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideDown 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        // ===========================
        // Helper Functions
        // ===========================
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
        // Initialize All
        // ===========================
        if (eventCards.length > 0) {
            initializeCardAnimations();
            animateStatusBadges();
            displayEventStats();
            prepareForFilters();
            initializeLazyLoad();
            enableEventDetailsCopy();
        } else {
            animateEmptyState();
        }

        initializeSmoothScroll();

        // ===========================
        // Console Message
        // ===========================
        console.log('%c📅 My Events Page Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');

    });

})();

// Add Required Styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }

    @keyframes fadeOut {
        to {
            opacity: 0;
        }
    }

    .fade-in {
        animation: fadeIn 0.6s ease forwards;
        opacity: 0;
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }

    /* Ripple Effect */
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(102, 126, 234, 0.3);
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

    /* Confirmation Dialog */
    .confirm-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease;
    }

    .confirm-dialog.show {
        animation: fadeIn 0.2s ease;
    }

    .confirm-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }

    .confirm-content {
        position: relative;
        background: white;
        padding: 2rem;
        border-radius: 16px;
        max-width: 400px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
        z-index: 1;
    }

    .confirm-content h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.75rem;
    }

    .confirm-content p {
        color: #6b7280;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    .confirm-actions {
        display: flex;
        gap: 0.75rem;
    }

    .btn-confirm-cancel,
    .btn-confirm-submit {
        flex: 1;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
    }

    .btn-confirm-cancel {
        background: #f3f4f6;
        color: #6b7280;
    }

    .btn-confirm-cancel:hover {
        background: #e5e7eb;
        transform: translateY(-2px);
    }

    .btn-confirm-submit {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-confirm-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    .toast-notification {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    /* Responsive Dialog */
    @media (max-width: 480px) {
        .confirm-content {
            max-width: 90vw;
            padding: 1.5rem;
            margin: 1rem;
        }

        .confirm-content h3 {
            font-size: 1.1rem;
        }

        .confirm-content p {
            font-size: 0.95rem;
        }

        .btn-confirm-cancel,
        .btn-confirm-submit {
            padding: 0.7rem 0.8rem;
            font-size: 0.9rem;
        }

        .toast-notification {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: calc(100vw - 2rem);
        }
    }

    /* Focus Visible */
    .btn-confirm-cancel:focus-visible,
    .btn-confirm-submit:focus-visible {
        outline: 2px solid #667eea;
        outline-offset: 2px;
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
        .confirm-dialog,
        .confirm-content,
        .toast-notification,
        .ripple {
            animation: none !important;
        }
    }
`;