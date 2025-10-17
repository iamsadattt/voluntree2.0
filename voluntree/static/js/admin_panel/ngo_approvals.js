// NGO Approvals Admin Panel JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Card Animations on Load
        // ===========================
        const ngoCards = document.querySelectorAll('.ngo-approval-card');

        ngoCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 100 * index);
        });

        // ===========================
        // Enhanced Approve/Reject Confirmation
        // ===========================
        const approveButtons = document.querySelectorAll('.btn-success');
        const rejectButtons = document.querySelectorAll('.btn-danger');
        const warningButtons = document.querySelectorAll('.btn-warning');

        approveButtons.forEach(button => {
            const form = button.closest('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();

                    const card = this.closest('.ngo-approval-card');
                    const ngoName = card.querySelector('.ngo-details h3').textContent.trim();
                    const regNumber = card.querySelector('.ngo-reg-number').textContent.trim();

                    const confirmed = confirm(
                        `✅ Approve NGO\n\n` +
                        `Organization: ${ngoName}\n` +
                        `${regNumber}\n\n` +
                        `This NGO will be approved and can start receiving donations.\n\n` +
                        `Do you want to proceed?`
                    );

                    if (confirmed) {
                        button.textContent = '⏳ Approving...';
                        button.disabled = true;
                        this.submit();
                    }
                });
            }
        });

        rejectButtons.forEach(button => {
            const form = button.closest('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();

                    const card = this.closest('.ngo-approval-card');
                    const ngoName = card.querySelector('.ngo-details h3').textContent.trim();
                    const regNumber = card.querySelector('.ngo-reg-number').textContent.trim();

                    const confirmed = confirm(
                        `⚠️ Warning: Reject NGO\n\n` +
                        `Organization: ${ngoName}\n` +
                        `${regNumber}\n\n` +
                        `This action will reject the NGO registration.\n` +
                        `The NGO will need to reapply if they want to join the platform.\n\n` +
                        `Are you sure you want to reject this NGO?`
                    );

                    if (confirmed) {
                        button.textContent = '⏳ Rejecting...';
                        button.disabled = true;
                        this.submit();
                    }
                });
            }
        });

        warningButtons.forEach(button => {
            const form = button.closest('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();

                    const card = this.closest('.ngo-approval-card');
                    const ngoName = card.querySelector('.ngo-details h3').textContent.trim();

                    const confirmed = confirm(
                        `⚠️ Revoke Approval\n\n` +
                        `Organization: ${ngoName}\n\n` +
                        `This will revoke the approval status.\n` +
                        `The NGO will no longer be able to receive donations.\n\n` +
                        `Are you sure you want to proceed?`
                    );

                    if (confirmed) {
                        button.textContent = '⏳ Revoking...';
                        button.disabled = true;
                        this.submit();
                    }
                });
            }
        });

        // ===========================
        // Filter Tab Animations
        // ===========================
        const filterTabs = document.querySelectorAll('.filter-tabs .tab');

        filterTabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                // Add loading animation
                const activeTab = document.querySelector('.filter-tabs .tab.active');
                if (activeTab && activeTab !== this) {
                    this.style.opacity = '0.7';
                    this.innerHTML = '⏳ Loading...';
                }
            });

            tab.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(-2px)';
                }
            });

            tab.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(0)';
                }
            });
        });

        // ===========================
        // Action Buttons Ripple Effect
        // ===========================
        const actionButtons = document.querySelectorAll('.btn-action, .btn-view-doc');

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
        if (!document.getElementById('ripple-animation-ngo')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-ngo';
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
        // Card Hover Enhancements
        // ===========================
        ngoCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const logo = this.querySelector('.ngo-logo');
                if (logo) {
                    logo.style.transform = 'scale(1.05) rotate(2deg)';
                }
            });

            card.addEventListener('mouseleave', function() {
                const logo = this.querySelector('.ngo-logo');
                if (logo) {
                    logo.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // ===========================
        // Status Badge Pulse Animation
        // ===========================
        const pendingBadges = document.querySelectorAll('.status-pending');

        pendingBadges.forEach(badge => {
            setInterval(() => {
                badge.style.animation = 'pulse 1s ease';
                setTimeout(() => {
                    badge.style.animation = '';
                }, 1000);
            }, 3000);
        });

        // Add pulse animation
        if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
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
        // Count Animation for Filter Tabs
        // ===========================
        filterTabs.forEach(tab => {
            const match = tab.textContent.match(/\((\d+)\)/);
            if (match) {
                const targetValue = parseInt(match[1]);
                const textBefore = tab.textContent.split('(')[0];

                if (!isNaN(targetValue)) {
                    let currentValue = 0;
                    const increment = Math.ceil(targetValue / 20);
                    const duration = 800;
                    const stepTime = duration / 20;

                    const counter = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= targetValue) {
                            tab.textContent = `${textBefore}(${targetValue})`;
                            clearInterval(counter);
                        } else {
                            tab.textContent = `${textBefore}(${currentValue})`;
                        }
                    }, stepTime);
                }
            }
        });

        // ===========================
        // Smooth Scroll to Top on Filter Change
        // ===========================
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });

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
        // Email Click to Copy
        // ===========================
        const emailElements = document.querySelectorAll('.ngo-contact');

        emailElements.forEach(element => {
            const text = element.textContent;
            const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);

            if (emailMatch) {
                const email = emailMatch[0];
                element.style.cursor = 'pointer';
                element.title = 'Click to copy email';

                element.addEventListener('click', function() {
                    navigator.clipboard.writeText(email).then(() => {
                        const originalText = this.textContent;
                        this.textContent = '✓ Email copied!';
                        this.style.color = '#10b981';
                        this.style.fontWeight = '600';

                        setTimeout(() => {
                            this.textContent = originalText;
                            this.style.color = '';
                            this.style.fontWeight = '';
                        }, 2000);
                    }).catch(() => {
                        alert('Could not copy email: ' + email);
                    });
                });
            }
        });

        // ===========================
        // View Details Button Enhancement
        // ===========================
        const viewDetailsButtons = document.querySelectorAll('.btn-info');

        viewDetailsButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                const card = this.closest('.ngo-approval-card');
                if (card) {
                    card.style.borderLeft = '4px solid #3b82f6';
                }
            });

            button.addEventListener('mouseleave', function() {
                const card = this.closest('.ngo-approval-card');
                if (card) {
                    card.style.borderLeft = '';
                }
            });
        });

        // ===========================
        // Document Link Preview
        // ===========================
        const documentLinks = document.querySelectorAll('.btn-view-doc');

        documentLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.textContent = '📄 Click to view document';
            });

            link.addEventListener('mouseleave', function() {
                this.textContent = '📄 View Document';
            });
        });

        // ===========================
        // Quick Stats Calculation
        // ===========================
        const calculateStats = () => {
            const pending = document.querySelectorAll('.status-pending').length;
            const approved = document.querySelectorAll('.status-approved').length;
            const rejected = document.querySelectorAll('.status-rejected').length;

            return {
                pending,
                approved,
                rejected,
                total: ngoCards.length
            };
        };

        // ===========================
        // Keyboard Shortcuts
        // ===========================
        document.addEventListener('keydown', function(e) {
            // Press 'P' for Pending filter
            if (e.key === 'p' || e.key === 'P') {
                const pendingTab = document.querySelector('[href*="status=pending"]');
                if (pendingTab && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    pendingTab.click();
                }
            }

            // Press 'A' for Approved filter
            if (e.key === 'a' || e.key === 'A') {
                const approvedTab = document.querySelector('[href*="status=approved"]');
                if (approvedTab && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    approvedTab.click();
                }
            }

            // Press 'R' for Rejected filter
            if (e.key === 'r' || e.key === 'R') {
                const rejectedTab = document.querySelector('[href*="status=rejected"]');
                if (rejectedTab && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    rejectedTab.click();
                }
            }
        });

        // ===========================
        // Add Keyboard Shortcuts Hint
        // ===========================
        const addKeyboardHints = () => {
            const filterTabsContainer = document.querySelector('.filter-tabs');
            if (filterTabsContainer && !document.getElementById('keyboard-hints')) {
                const hintsDiv = document.createElement('div');
                hintsDiv.id = 'keyboard-hints';
                hintsDiv.style.cssText = `
                    text-align: center;
                    color: #6b7280;
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    padding: 0.5rem;
                `;
                hintsDiv.innerHTML = '⌨️ Keyboard shortcuts: <kbd>P</kbd> Pending, <kbd>A</kbd> Approved, <kbd>R</kbd> Rejected';

                const kbdStyle = document.createElement('style');
                kbdStyle.textContent = `
                    kbd {
                        background: #f3f4f6;
                        border: 1px solid #d1d5db;
                        border-radius: 4px;
                        padding: 2px 6px;
                        font-family: monospace;
                        font-size: 0.8rem;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    }
                `;
                document.head.appendChild(kbdStyle);

                filterTabsContainer.appendChild(hintsDiv);
            }
        };

        addKeyboardHints();

        // ===========================
        // Loading State for Actions
        // ===========================
        const allActionForms = document.querySelectorAll('.ngo-card-actions form');

        allActionForms.forEach(form => {
            form.addEventListener('submit', function() {
                const card = this.closest('.ngo-approval-card');
                if (card) {
                    card.style.opacity = '0.6';
                    card.style.pointerEvents = 'none';
                }
            });
        });

        // ===========================
        // Highlight Important Information
        // ===========================
        const highlightPendingInfo = () => {
            const pendingCards = document.querySelectorAll('.status-pending');

            pendingCards.forEach(badge => {
                const card = badge.closest('.ngo-approval-card');
                if (card) {
                    card.style.borderLeft = '4px solid #f59e0b';
                }
            });
        };

        highlightPendingInfo();

        // ===========================
        // Website Link Validation
        // ===========================
        const websiteLinks = document.querySelectorAll('.meta-item a[href*="http"]');

        websiteLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const url = this.getAttribute('href');
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    e.preventDefault();
                    alert('Invalid website URL');
                }
            });
        });

        // ===========================
        // Card Selection for Comparison
        // ===========================
        let selectedCards = [];

        ngoCards.forEach(card => {
            card.addEventListener('dblclick', function() {
                if (this.classList.contains('card-selected')) {
                    this.classList.remove('card-selected');
                    this.style.outline = '';
                    selectedCards = selectedCards.filter(c => c !== this);
                } else if (selectedCards.length < 3) {
                    this.classList.add('card-selected');
                    this.style.outline = '3px solid #10b981';
                    selectedCards.push(this);
                }

                console.log(`Selected ${selectedCards.length} card(s) for comparison`);
            });
        });

        // ===========================
        // Registration Date Formatting
        // ===========================
        const formatDates = () => {
            const dateElements = document.querySelectorAll('.meta-item');

            dateElements.forEach(element => {
                const text = element.textContent;
                if (text.includes('Registered:')) {
                    const dateMatch = text.match(/\w+ \d+, \d{4}/);
                    if (dateMatch) {
                        const date = new Date(dateMatch[0]);
                        const now = new Date();
                        const diffTime = Math.abs(now - date);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        element.title = `Registered ${diffDays} days ago`;
                    }
                }
            });
        };

        formatDates();

        // ===========================
        // No Data Icon Animation Enhancement
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
        // Console Log for Debug
        // ===========================
        console.log('✅ NGO Approvals Admin Panel initialized');
        console.log(`📊 Total NGO cards: ${ngoCards.length}`);

        const stats = calculateStats();
        console.log('📈 Quick Stats:', stats);
        console.log('⌨️ Keyboard shortcuts enabled: P (Pending), A (Approved), R (Rejected)');

        // ===========================
        // Performance Monitoring
        // ===========================
        const measurePerformance = () => {
            const loadTime = performance.now();
            console.log(`⚡ Page interactions loaded in ${loadTime.toFixed(2)}ms`);
        };

        measurePerformance();

    });

})();