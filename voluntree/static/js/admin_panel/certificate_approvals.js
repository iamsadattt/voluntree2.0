// Certificate Approvals Admin Panel JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Certificate Card Animations on Load
        // ===========================
        const certificateCards = document.querySelectorAll('.certificate-card');

        certificateCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });

        // ===========================
        // Enhanced Confirmation Dialogs
        // ===========================

        // Approve confirmation
        const approveButtons = document.querySelectorAll('.btn-success');
        approveButtons.forEach(button => {
            const form = button.closest('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    const eventTitle = this.closest('.certificate-card')
                        .querySelector('.certificate-details h3').textContent;

                    const confirmed = confirm(
                        `✓ Approve Certificate\n\n` +
                        `Event: ${eventTitle}\n\n` +
                        `This will allow the NGO to assign certificates to volunteers.\n\n` +
                        `Do you want to approve this certificate?`
                    );

                    if (confirmed) {
                        button.textContent = '⏳ Approving...';
                        button.disabled = true;
                    } else {
                        e.preventDefault();
                    }
                });
            }
        });

        // Reject/Revoke confirmation
        const rejectButtons = document.querySelectorAll('.btn-danger, .btn-warning');
        rejectButtons.forEach(button => {
            const form = button.closest('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    const card = this.closest('.certificate-card');
                    const eventTitle = card.querySelector('.certificate-details h3').textContent;
                    const ngoName = card.querySelector('.certificate-ngo').textContent;
                    const isRevoke = button.classList.contains('btn-warning');

                    const confirmed = confirm(
                        `⚠️ ${isRevoke ? 'Revoke Approval' : 'Reject Certificate'}\n\n` +
                        `Event: ${eventTitle}\n` +
                        `NGO: ${ngoName}\n\n` +
                        `${isRevoke ? 
                            'This will revoke the approval and delete the certificate. The NGO will need to upload a new one.' : 
                            'This will reject and delete the certificate. The NGO will need to upload a new one.'}\n\n` +
                        `This action cannot be undone. Continue?`
                    );

                    if (confirmed) {
                        button.textContent = '⏳ Processing...';
                        button.disabled = true;
                    } else {
                        e.preventDefault();
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
                z-index: 10;
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

            // Keyboard shortcut hint
            searchInput.setAttribute('placeholder',
                searchInput.getAttribute('placeholder') + ' (Ctrl+K)');
        }

        // ===========================
        // Status Badge Animations
        // ===========================
        const statusBadges = document.querySelectorAll('.status-badge');

        statusBadges.forEach(badge => {
            badge.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.15)';
                this.style.animationPlayState = 'paused';
            });

            badge.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.animationPlayState = 'running';
            });
        });

        // ===========================
        // Action Buttons Ripple Effect
        // ===========================
        const actionButtons = document.querySelectorAll('.btn-action, .btn-preview, .btn-download');

        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Skip ripple for form submissions that will navigate away
                if (this.tagName === 'BUTTON') {
                    return;
                }

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
        if (!document.getElementById('ripple-animation-cert')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-cert';
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
        // Certificate Card Hover Enhancement
        // ===========================
        certificateCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });

            // Highlight card when hovering over action buttons
            const buttons = card.querySelectorAll('.btn-action');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    card.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                });

                btn.addEventListener('mouseleave', function() {
                    if (!card.matches(':hover')) {
                        card.style.borderColor = 'transparent';
                    }
                });
            });
        });

        // ===========================
        // NGO Logo Hover Animation
        // ===========================
        const logos = document.querySelectorAll('.ngo-logo');

        logos.forEach(logo => {
            logo.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });

        // ===========================
        // Count Animation for Filter Tabs
        // ===========================
        const tabs = document.querySelectorAll('.filter-tabs .tab');

        tabs.forEach(tab => {
            const match = tab.textContent.match(/\((\d+)\)/);
            if (match) {
                const targetValue = parseInt(match[1]);
                const countSpan = document.createElement('span');
                const textContent = tab.textContent.replace(/\(\d+\)/, '');

                tab.textContent = textContent + '(';
                tab.appendChild(countSpan);
                tab.appendChild(document.createTextNode(')'));

                let currentValue = 0;
                const increment = Math.ceil(targetValue / 20);
                const duration = 800;
                const stepTime = duration / 20;

                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        countSpan.textContent = targetValue;
                        clearInterval(counter);
                    } else {
                        countSpan.textContent = currentValue;
                    }
                }, stepTime);
            }
        });

        // ===========================
        // Info Item Hover Effects
        // ===========================
        const infoItems = document.querySelectorAll('.info-item');

        infoItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });

        // ===========================
        // Certificate Preview Enhancement
        // ===========================
        const previewButtons = document.querySelectorAll('.btn-preview');

        previewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-2px)';
                }, 150);
            });
        });

        // ===========================
        // Download Button Enhancement
        // ===========================
        const downloadButtons = document.querySelectorAll('.btn-download');

        downloadButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-2px)';
                }, 150);

                // Show download notification
                showNotification('📥 Download started...', 'success');
            });
        });

        // ===========================
        // Notification System
        // ===========================
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                             type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                             'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
                font-weight: 600;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Add notification animations
        if (!document.getElementById('notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Filter Tab Active State Enhancement
        // ===========================
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                // Visual feedback on click
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-2px)';
                }, 100);
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

            // Navigate between filter tabs with numbers
            if (e.altKey && e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                const tabIndex = parseInt(e.key) - 1;
                if (tabs[tabIndex]) {
                    tabs[tabIndex].click();
                }
            }
        });

        // ===========================
        // Loading State for Forms
        // ===========================
        const searchForm = document.querySelector('.search-box form');
        const searchButton = document.querySelector('.btn-search');

        if (searchForm && searchButton) {
            searchForm.addEventListener('submit', function() {
                searchButton.textContent = '⏳ Searching...';
                searchButton.disabled = true;
            });
        }

        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                this.style.opacity = '0.6';
                this.disabled = true;

                // Show loading indicator
                const loadingText = document.createElement('div');
                loadingText.textContent = '⏳ Sorting...';
                loadingText.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 1.5rem 2rem;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                    font-weight: 600;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                `;
                document.body.appendChild(loadingText);
            });
        }

        // ===========================
        // Smooth Scroll on Page Load
        // ===========================
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        }

        // ===========================
        // Card Selection on Click (outside actions)
        // ===========================
        certificateCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't select if clicking on action buttons, links, or forms
                if (e.target.closest('.btn-action') ||
                    e.target.closest('.btn-preview') ||
                    e.target.closest('.btn-download') ||
                    e.target.closest('form') ||
                    e.target.tagName === 'A') {
                    return;
                }

                // Remove previous selection
                document.querySelectorAll('.certificate-card').forEach(c => {
                    c.style.borderColor = 'transparent';
                });

                // Highlight current card
                this.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                this.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.15)';
            });
        });

        // ===========================
        // Double Click to View Details
        // ===========================
        certificateCards.forEach(card => {
            card.addEventListener('dblclick', function() {
                const detailsButton = this.querySelector('a[href*="certificate_detail"]');
                if (detailsButton) {
                    detailsButton.click();
                }
            });
        });

        // ===========================
        // Tooltip for Filter Tabs (Alt + Number)
        // ===========================
        tabs.forEach((tab, index) => {
            if (index < 4) {
                tab.title = `Alt + ${index + 1} to switch`;
            }
        });

        // ===========================
        // Auto-hide No Data Message Animation
        // ===========================
        const noDataMessage = document.querySelector('.no-data-message');
        if (noDataMessage) {
            noDataMessage.style.opacity = '0';
            noDataMessage.style.transform = 'scale(0.9)';

            setTimeout(() => {
                noDataMessage.style.transition = 'all 0.6s ease';
                noDataMessage.style.opacity = '1';
                noDataMessage.style.transform = 'scale(1)';
            }, 300);
        }

        // ===========================
        // Lazy Load Certificate Previews (if needed)
        // ===========================
        const certificatePreviews = document.querySelectorAll('.certificate-preview');

        if ('IntersectionObserver' in window) {
            const previewObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeIn 0.6s ease';
                        previewObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            certificatePreviews.forEach(preview => {
                previewObserver.observe(preview);
            });
        }

        // ===========================
        // Track User Actions for Analytics (optional)
        // ===========================
        function trackAction(action, details) {
            console.log(`📊 Action: ${action}`, details);
            // Could send to analytics service here
        }

        // Track button clicks
        document.querySelectorAll('.btn-action').forEach(btn => {
            btn.addEventListener('click', function() {
                trackAction('button_click', {
                    button: this.textContent.trim(),
                    timestamp: new Date().toISOString()
                });
            });
        });

        // ===========================
        // Performance Optimization
        // ===========================
        // Debounce function for performance
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

        // Optimized scroll handler
        const handleScroll = debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add scroll-to-top button if scrolled down
            if (scrollTop > 300 && !document.getElementById('scroll-top-btn')) {
                addScrollToTopButton();
            } else if (scrollTop <= 300 && document.getElementById('scroll-top-btn')) {
                document.getElementById('scroll-top-btn').remove();
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);

        // ===========================
        // Scroll to Top Button
        // ===========================
        function addScrollToTopButton() {
            const btn = document.createElement('button');
            btn.id = 'scroll-top-btn';
            btn.innerHTML = '↑';
            btn.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                z-index: 9999;
                transition: all 0.3s ease;
                animation: slideInUp 0.3s ease;
            `;

            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            });

            btn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            document.body.appendChild(btn);

            // Add animation
            if (!document.getElementById('scroll-top-animation')) {
                const style = document.createElement('style');
                style.id = 'scroll-top-animation';
                style.textContent = `
                    @keyframes slideInUp {
                        from {
                            transform: translateY(100px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // ===========================
        // Console Log for Debug
        // ===========================
        console.log('✅ Certificate Approvals Admin Panel initialized');
        console.log(`📜 Total certificates: ${certificateCards.length}`);
        console.log(`🏷️ Filter tabs: ${tabs.length}`);
        console.log('⌨️ Keyboard shortcuts: Ctrl+K (search), Alt+1-4 (tabs)');

    });

})();