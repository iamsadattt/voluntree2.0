// Admin Dashboard JavaScript - Voluntree Design Language
(function() {
    'use strict';

    // ===== DOM CACHE =====
    const DOM = {
        statCards: null,
        activityItems: null,
        tableRows: null,
        statNumbers: null
    };

    function cacheDOM() {
        DOM.statCards = document.querySelectorAll('.stat-card');
        DOM.activityItems = document.querySelectorAll('.activity-item');
        DOM.tableRows = document.querySelectorAll('.admin-table tbody tr');
        DOM.statNumbers = document.querySelectorAll('.stat-number');
    }

    // ===== STAT COUNTER ANIMATION =====
    const stats = {
        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateNumber(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            DOM.statNumbers.forEach(stat => observer.observe(stat));
        },

        animateNumber(element) {
            const target = parseInt(element.textContent.replace(/,/g, '')) || 0;
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    element.textContent = this.formatNumber(target);
                    clearInterval(timer);
                } else {
                    element.textContent = this.formatNumber(Math.floor(current));
                }
            }, 16);
        },

        formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    };

    // ===== CARD INTERACTIONS =====
    const cards = {
        init() {
            DOM.statCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.zIndex = '10';
                });

                card.addEventListener('mouseleave', function() {
                    this.style.zIndex = '';
                });

                // Add click ripple effect
                card.addEventListener('click', function(e) {
                    interactions.createRipple(e, this);
                });
            });
        }
    };

    // ===== ACTIVITY ITEMS =====
    const activities = {
        init() {
            DOM.activityItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;

                item.addEventListener('click', function() {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
        }
    };

    // ===== TABLE ENHANCEMENTS =====
    const table = {
        init() {
            if (!DOM.tableRows.length) return;

            // Add row numbers
            DOM.tableRows.forEach((row, index) => {
                if (!row.classList.contains('no-data')) {
                    row.dataset.index = index + 1;
                }
            });

            // Make rows clickable (if needed)
            DOM.tableRows.forEach(row => {
                if (!row.classList.contains('no-data')) {
                    row.style.cursor = 'pointer';

                    row.addEventListener('click', function() {
                        // Highlight selected row
                        DOM.tableRows.forEach(r => r.classList.remove('selected'));
                        this.classList.add('selected');
                    });
                }
            });

            // Add sorting capability
            this.setupSorting();
        },

        setupSorting() {
            const headers = document.querySelectorAll('.admin-table th');
            headers.forEach((header, index) => {
                header.style.cursor = 'pointer';
                header.setAttribute('data-sort', 'none');

                header.addEventListener('click', () => {
                    this.sortTable(index, header);
                });

                // Add sort indicator
                const indicator = document.createElement('span');
                indicator.className = 'sort-indicator';
                indicator.textContent = ' ↕';
                indicator.style.opacity = '0.3';
                header.appendChild(indicator);
            });
        },

        sortTable(columnIndex, header) {
            const tbody = document.querySelector('.admin-table tbody');
            const rows = Array.from(tbody.querySelectorAll('tr:not(.no-data)'));

            if (rows.length === 0) return;

            const currentSort = header.getAttribute('data-sort');
            const newSort = currentSort === 'asc' ? 'desc' : 'asc';

            // Update header
            header.setAttribute('data-sort', newSort);
            const indicator = header.querySelector('.sort-indicator');
            indicator.textContent = newSort === 'asc' ? ' ↑' : ' ↓';
            indicator.style.opacity = '1';

            // Reset other headers
            document.querySelectorAll('.admin-table th').forEach(h => {
                if (h !== header) {
                    h.setAttribute('data-sort', 'none');
                    h.querySelector('.sort-indicator').textContent = ' ↕';
                    h.querySelector('.sort-indicator').style.opacity = '0.3';
                }
            });

            // Sort rows
            rows.sort((a, b) => {
                const aValue = a.cells[columnIndex].textContent.trim();
                const bValue = b.cells[columnIndex].textContent.trim();

                const comparison = aValue.localeCompare(bValue, undefined, { numeric: true });
                return newSort === 'asc' ? comparison : -comparison;
            });

            // Re-append rows
            rows.forEach(row => tbody.appendChild(row));
        }
    };

    // ===== INTERACTIONS =====
    const interactions = {
        createRipple(event, element) {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(102, 126, 234, 0.3);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        }
    };

    // ===== REFRESH FUNCTIONALITY =====
    const refresh = {
        init() {
            // Add refresh button to dashboard header
            const header = document.querySelector('.dashboard-header');
            if (header) {
                const refreshBtn = document.createElement('button');
                refreshBtn.className = 'btn-refresh';
                refreshBtn.innerHTML = '🔄 Refresh';
                refreshBtn.style.cssText = `
                    padding: 0.75rem 1.5rem;
                    background: white;
                    color: #667eea;
                    border: 2px solid #667eea;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 1rem;
                `;

                refreshBtn.addEventListener('click', () => {
                    this.refreshDashboard(refreshBtn);
                });

                refreshBtn.addEventListener('mouseenter', function() {
                    this.style.background = '#667eea';
                    this.style.color = 'white';
                    this.style.transform = 'translateY(-2px)';
                });

                refreshBtn.addEventListener('mouseleave', function() {
                    this.style.background = 'white';
                    this.style.color = '#667eea';
                    this.style.transform = '';
                });

                header.appendChild(refreshBtn);
            }
        },

        refreshDashboard(button) {
            button.disabled = true;
            button.textContent = '⟳ Refreshing...';
            button.style.animation = 'spin 1s linear infinite';

            // Simulate refresh (reload page)
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    // ===== AUTO-REFRESH =====
    const autoRefresh = {
        interval: null,
        duration: 5 * 60 * 1000, // 5 minutes

        init() {
            // Show last updated time
            this.showLastUpdated();

            // Set up auto-refresh
            this.interval = setInterval(() => {
                console.log('Auto-refreshing dashboard...');
                // Uncomment to enable auto-refresh
                // window.location.reload();
            }, this.duration);
        },

        showLastUpdated() {
            const header = document.querySelector('.dashboard-header p');
            if (header) {
                const time = new Date().toLocaleTimeString();
                const span = document.createElement('span');
                span.style.cssText = `
                    display: block;
                    font-size: 0.875rem;
                    color: #9ca3af;
                    margin-top: 0.5rem;
                `;
                span.textContent = `Last updated: ${time}`;
                header.appendChild(span);
            }
        }
    };

    // ===== TOOLTIPS =====
    const tooltips = {
        init() {
            // Add tooltips to stat cards
            DOM.statCards.forEach(card => {
                const title = card.querySelector('h3').textContent;
                card.setAttribute('data-tooltip', `View ${title} details`);

                card.addEventListener('mouseenter', function(e) {
                    tooltips.show(this, this.getAttribute('data-tooltip'));
                });

                card.addEventListener('mouseleave', function() {
                    tooltips.hide(this);
                });
            });
        },

        show(element, text) {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
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
            `;

            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;

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

    // ===== INITIALIZE =====
    function init() {
        cacheDOM();
        stats.init();
        cards.init();
        activities.init();
        table.init();
        refresh.init();
        autoRefresh.init();
        tooltips.init();

        console.log('%c📊 Dashboard Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log('%cAuto-refresh: 5 minutes', 'color: #6b7280; font-size: 12px;');
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
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .admin-table tbody tr.selected {
        background: rgba(102, 126, 234, 0.1);
        border-left: 3px solid #667eea;
    }

    .sort-indicator {
        transition: opacity 0.3s ease;
    }

    .btn-refresh:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

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