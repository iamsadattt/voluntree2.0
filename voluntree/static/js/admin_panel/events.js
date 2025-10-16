// Admin Events page specific JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Table Row Staggered Animation
        // ===========================
        const tableRows = document.querySelectorAll('.admin-table tbody tr');

        tableRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });

        // ===========================
        // Status Badge Animations
        // ===========================
        const statusBadges = document.querySelectorAll('.status-badge');

        statusBadges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'scale(0.8)';
            badge.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

            setTimeout(() => {
                badge.style.opacity = '1';
                badge.style.transform = 'scale(1)';
            }, 200 + (index * 30));
        });

        // Pulse animation for pending certificates
        const pendingBadges = document.querySelectorAll('.status-badge.status-pending');
        pendingBadges.forEach(badge => {
            badge.style.animation = 'subtlePulse 2s ease-in-out infinite';
        });

        if (!document.getElementById('subtle-pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'subtle-pulse-animation';
            style.textContent = `
                @keyframes subtlePulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Add Ripple Effect to Buttons
        // ===========================
        const buttons = document.querySelectorAll('.btn-search, .btn-action-small, .page-link');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                    z-index: 1;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation CSS
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Event Image Hover Zoom
        // ===========================
        const eventImages = document.querySelectorAll('.event-image-small');

        eventImages.forEach(img => {
            img.style.cursor = 'pointer';

            img.addEventListener('click', function() {
                const imgSrc = this.querySelector('img');
                if (imgSrc) {
                    createImageModal(imgSrc.src, imgSrc.alt);
                }
            });
        });

        function createImageModal(src, alt) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 2rem;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;

            const img = document.createElement('img');
            img.src = src;
            img.alt = alt;
            img.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: scaleIn 0.3s ease;
            `;

            modal.appendChild(img);
            document.body.appendChild(modal);

            modal.addEventListener('click', function() {
                this.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => this.remove(), 300);
            });
        }

        if (!document.getElementById('modal-animations')) {
            const style = document.createElement('style');
            style.id = 'modal-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes scaleIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Delete Confirmation Enhancement
        // ===========================
        const deleteForms = document.querySelectorAll('form[action*="delete"]');

        deleteForms.forEach(form => {
            const deleteBtn = form.querySelector('.btn-danger');

            if (deleteBtn) {
                let clickCount = 0;
                let clickTimeout;

                deleteBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    clickCount++;

                    if (clickCount === 1) {
                        const originalContent = this.innerHTML;
                        this.innerHTML = '⚠️';
                        this.style.animation = 'intensePulse 0.5s ease';

                        clickTimeout = setTimeout(() => {
                            this.innerHTML = originalContent;
                            clickCount = 0;
                            this.style.animation = '';
                        }, 2000);

                    } else if (clickCount === 2) {
                        clearTimeout(clickTimeout);

                        const eventTitle = this.closest('tr').querySelector('strong').textContent;
                        if (confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
                            this.disabled = true;
                            this.innerHTML = '⏳';
                            this.style.opacity = '0.7';
                            form.submit();
                        } else {
                            this.innerHTML = '🗑️';
                            clickCount = 0;
                            this.style.animation = '';
                        }
                    }
                });
            }
        });

        if (!document.getElementById('intense-pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'intense-pulse-animation';
            style.textContent = `
                @keyframes intensePulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Search Input Focus Animation
        // ===========================
        const searchInput = document.querySelector('.search-input');

        if (searchInput) {
            searchInput.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'transform 0.3s ease';
            });

            searchInput.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
            });

            // Auto-focus if there's a search query
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('search')) {
                setTimeout(() => searchInput.focus(), 500);
            }
        }

        // ===========================
        // Filter Select Change Animation
        // ===========================
        const filterSelect = document.querySelector('.filter-select');

        if (filterSelect) {
            filterSelect.addEventListener('change', function() {
                this.style.animation = 'filterChange 0.5s ease';
                showToast('Filtering events...', 'info');
            });
        }

        if (!document.getElementById('filter-change-animation')) {
            const style = document.createElement('style');
            style.id = 'filter-change-animation';
            style.textContent = `
                @keyframes filterChange {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                        background: rgba(102, 126, 234, 0.1);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Row Hover Highlight
        // ===========================
        tableRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                const statusBadge = this.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.style.transform = 'scale(1.1)';
                    statusBadge.style.transition = 'transform 0.3s ease';
                }
            });

            row.addEventListener('mouseleave', function() {
                const statusBadge = this.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.style.transform = 'scale(1)';
                }
            });
        });

        // ===========================
        // Certificate Status Click Info
        // ===========================
        const certificateStatusBadges = document.querySelectorAll('.admin-table tbody td:nth-child(8) .status-badge');

        certificateStatusBadges.forEach(badge => {
            badge.style.cursor = 'pointer';
            badge.title = 'Click for certificate details';

            badge.addEventListener('click', function() {
                const row = this.closest('tr');
                const eventTitle = row.querySelector('strong').textContent;
                const status = this.textContent.trim();
                showToast(`Certificate status for "${eventTitle}": ${status}`, 'info');
            });
        });

        // ===========================
        // Toast Notification Function
        // ===========================
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.textContent = message;

            let backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            if (type === 'success') {
                backgroundColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            } else if (type === 'warning') {
                backgroundColor = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            } else if (type === 'error') {
                backgroundColor = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            }

            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: ${backgroundColor};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                font-weight: 600;
                animation: slideInUp 0.3s ease;
                max-width: 400px;
            `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideOutDown 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        if (!document.getElementById('toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideOutDown {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Keyboard Shortcuts
        // ===========================
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + F to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f' && searchInput) {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }

            // ESC to clear search
            if (e.key === 'Escape' && searchInput) {
                if (searchInput === document.activeElement) {
                    searchInput.value = '';
                    searchInput.blur();
                }
            }
        });

        // ===========================
        // Statistics Counter Animation
        // ===========================
        const totalEventsEl = document.querySelector('.toolbar-info strong');

        if (totalEventsEl) {
            const targetValue = parseInt(totalEventsEl.textContent);
            if (!isNaN(targetValue)) {
                animateCounter(totalEventsEl, targetValue);
            }
        }

        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 30;
            const duration = 1000;
            const stepTime = duration / 30;

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(counter);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, stepTime);
        }

        // ===========================
        // Quick View on Row Click
        // ===========================
        tableRows.forEach(row => {
            row.addEventListener('click', function(e) {
                // Don't trigger if clicking on buttons or links
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
                    return;
                }

                const viewBtn = this.querySelector('.btn-info');
                if (viewBtn) {
                    viewBtn.style.animation = 'quickFlash 0.3s ease';
                }
            });
        });

        if (!document.getElementById('quick-flash-animation')) {
            const style = document.createElement('style');
            style.id = 'quick-flash-animation';
            style.textContent = `
                @keyframes quickFlash {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    }
                    50% {
                        transform: scale(1.1);
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Volunteers Progress Bar
        // ===========================
        const volunteerCells = document.querySelectorAll('.admin-table tbody td.text-center');

        volunteerCells.forEach(cell => {
            const text = cell.textContent.trim();
            const match = text.match(/(\d+)\s*\/\s*(\d+)/);

            if (match) {
                const current = parseInt(match[1]);
                const max = parseInt(match[2]);
                const percentage = (current / max) * 100;

                const progressBar = document.createElement('div');
                progressBar.style.cssText = `
                    width: 100%;
                    height: 4px;
                    background: #e5e7eb;
                    border-radius: 2px;
                    margin-top: 6px;
                    overflow: hidden;
                `;

                const progressFill = document.createElement('div');
                progressFill.style.cssText = `
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 2px;
                    width: 0;
                    transition: width 1s ease 0.5s;
                `;

                if (percentage >= 100) {
                    progressFill.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                } else if (percentage >= 80) {
                    progressFill.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                }

                progressBar.appendChild(progressFill);
                cell.appendChild(progressBar);

                setTimeout(() => {
                    progressFill.style.width = `${percentage}%`;
                }, 100);
            }
        });

        // ===========================
        // Highlight Full Events
        // ===========================
        const fullBadges = document.querySelectorAll('.badge-full');
        fullBadges.forEach(badge => {
            badge.style.animation = 'pulse 1.5s ease-in-out infinite';
        });

        if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Scroll to Top Button
        // ===========================
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
            z-index: 9998;
            pointer-events: none;
        `;

        document.body.appendChild(scrollToTopBtn);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.transform = 'scale(1)';
                scrollToTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.transform = 'scale(0.8)';
                scrollToTopBtn.style.pointerEvents = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        scrollToTopBtn.addEventListener('mouseleave', function() {
            if (window.pageYOffset > 300) {
                this.style.transform = 'scale(1)';
            }
        });

        // ===========================
        // Log Page View
        // ===========================
        if (typeof console !== 'undefined') {
            console.log('Admin Events Page Viewed');
            console.log('Total Events Displayed:', tableRows.length);
        }

    });

})();