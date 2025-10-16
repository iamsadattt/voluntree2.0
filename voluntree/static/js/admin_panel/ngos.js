// NGOs Management Admin Panel JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Table Row Animations on Load
        // ===========================
        const tableRows = document.querySelectorAll('.admin-table tbody tr');

        tableRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, 100 * index);
        });

        // ===========================
        // Enhanced Delete Confirmation
        // ===========================
        const deleteButtons = document.querySelectorAll('.btn-danger');

        deleteButtons.forEach(button => {
            const form = button.closest('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();

                    const ngoName = this.closest('tr').querySelector('strong').textContent;
                    const eventCount = this.closest('tr').querySelector('.text-center').textContent;

                    const confirmed = confirm(
                        `⚠️ Warning: This action cannot be undone!\n\n` +
                        `You are about to delete "${ngoName}".\n` +
                        `This will also delete ${eventCount} event(s) created by this NGO.\n\n` +
                        `Do you want to proceed?`
                    );

                    if (confirmed) {
                        // Add loading state
                        button.textContent = '⏳';
                        button.disabled = true;
                        this.submit();
                    }
                });
            }
        });

        // ===========================
        // Search Input Enhancements
        // ===========================
        const searchInput = document.querySelector('.search-input');

        if (searchInput) {
            let searchTimeout;

            // Add clear button dynamically
            const clearBtn = document.createElement('button');
            clearBtn.textContent = '✕';
            clearBtn.className = 'search-clear';
            clearBtn.type = 'button';
            clearBtn.style.cssText = `
                position: absolute;
                right: 110px;
                top: 50%;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                font-size: 1.2rem;
                color: #9ca3af;
                cursor: pointer;
                padding: 0.5rem;
                display: none;
                transition: color 0.3s ease;
            `;

            clearBtn.addEventListener('mouseenter', function() {
                this.style.color = '#ef4444';
            });

            clearBtn.addEventListener('mouseleave', function() {
                this.style.color = '#9ca3af';
            });

            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                this.style.display = 'none';
                searchInput.focus();
            });

            const searchBox = document.querySelector('.search-box form');
            searchBox.style.position = 'relative';
            searchBox.appendChild(clearBtn);

            // Show/hide clear button
            searchInput.addEventListener('input', function() {
                clearBtn.style.display = this.value ? 'block' : 'none';
            });

            // Initial state
            if (searchInput.value) {
                clearBtn.style.display = 'block';
            }

            // Add visual feedback while typing
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                this.style.borderColor = '#f59e0b';

                searchTimeout = setTimeout(() => {
                    this.style.borderColor = '#e5e7eb';
                }, 1000);
            });
        }

        // ===========================
        // Status Badge Hover Effects
        // ===========================
        const statusBadges = document.querySelectorAll('.status-badge');

        statusBadges.forEach(badge => {
            badge.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });

            badge.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // ===========================
        // Action Buttons Ripple Effect
        // ===========================
        const actionButtons = document.querySelectorAll('.btn-action-small');

        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    animation: ripple 0.6s ease-out;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation if not exists
        if (!document.getElementById('ripple-animation-admin')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-admin';
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
        // Row Highlight on Action
        // ===========================
        actionButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                const row = this.closest('tr');
                if (row) {
                    row.style.background = 'linear-gradient(to right, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                }
            });

            button.addEventListener('mouseleave', function() {
                const row = this.closest('tr');
                if (row && !row.matches(':hover')) {
                    row.style.background = '';
                }
            });
        });

        // ===========================
        // Logo Hover Animation
        // ===========================
        const logos = document.querySelectorAll('.ngo-logo-small');

        logos.forEach(logo => {
            logo.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });

        // ===========================
        // Count Animation for Stats
        // ===========================
        const toolbarInfo = document.querySelector('.toolbar-info');

        if (toolbarInfo) {
            const strongElements = toolbarInfo.querySelectorAll('strong');

            strongElements.forEach(strong => {
                const targetValue = parseInt(strong.textContent);
                if (!isNaN(targetValue)) {
                    let currentValue = 0;
                    const increment = Math.ceil(targetValue / 30);
                    const duration = 1000;
                    const stepTime = duration / 30;

                    const counter = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= targetValue) {
                            strong.textContent = targetValue;
                            clearInterval(counter);
                        } else {
                            strong.textContent = currentValue;
                        }
                    }, stepTime);
                }
            });
        }

        // ===========================
        // Smooth Scroll to Top on Pagination
        // ===========================
        const pageLinks = document.querySelectorAll('.page-link');

        pageLinks.forEach(link => {
            link.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });

        // ===========================
        // Table Sort Functionality (optional enhancement)
        // ===========================
        const tableHeaders = document.querySelectorAll('.admin-table th');

        tableHeaders.forEach((header, index) => {
            // Skip action column
            if (header.textContent.toLowerCase().includes('action') ||
                header.textContent.toLowerCase().includes('logo')) {
                return;
            }

            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            header.title = 'Click to sort';

            header.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            });

            header.addEventListener('mouseleave', function() {
                this.style.background = '';
            });
        });

        // ===========================
        // Row Selection Highlight
        // ===========================
        tableRows.forEach(row => {
            row.addEventListener('click', function(e) {
                // Don't highlight if clicking on action buttons
                if (e.target.closest('.btn-action-small') ||
                    e.target.closest('form')) {
                    return;
                }

                // Remove previous selection
                document.querySelectorAll('.admin-table tbody tr').forEach(r => {
                    r.style.background = '';
                });

                // Highlight current row
                this.style.background = 'linear-gradient(to right, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)';
            });
        });

        // ===========================
        // Keyboard Navigation
        // ===========================
        document.addEventListener('keydown', function(e) {
            // Focus search on Ctrl/Cmd + K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });

        // ===========================
        // Add Keyboard Shortcut Hint
        // ===========================
        if (searchInput) {
            searchInput.setAttribute('placeholder',
                searchInput.getAttribute('placeholder') + ' (Ctrl+K)');
        }

        // ===========================
        // Loading State for Search
        // ===========================
        const searchForm = document.querySelector('.search-box form');
        const searchButton = document.querySelector('.btn-search');

        if (searchForm && searchButton) {
            searchForm.addEventListener('submit', function() {
                searchButton.textContent = '⏳ Searching...';
                searchButton.disabled = true;
            });
        }

        // ===========================
        // Console Log for Debug
        // ===========================
        console.log('✅ NGOs Admin Panel initialized');
        console.log(`📊 Total rows: ${tableRows.length}`);

    });

})();