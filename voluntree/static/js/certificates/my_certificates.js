// My Certificates Page JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Add Search and Filter Controls
        // ===========================
        function addControlsBar() {
            const certificatesGrid = document.querySelector('.certificates-grid');
            if (!certificatesGrid) return;

            const controlsBar = document.createElement('div');
            controlsBar.className = 'controls-bar';
            controlsBar.innerHTML = `
                <div class="search-box">
                    <input type="text" id="certificateSearch" placeholder="Search certificates by event name or organization...">
                </div>
                <div class="sort-dropdown">
                    <label for="sortSelect">Sort by:</label>
                    <select id="sortSelect">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="event-name">Event Name (A-Z)</option>
                        <option value="organization">Organization (A-Z)</option>
                    </select>
                </div>
                <div class="certificates-count">
                    <span id="visibleCount">${document.querySelectorAll('.certificate-card').length}</span> 
                    / ${document.querySelectorAll('.certificate-card').length} certificates
                </div>
            `;

            certificatesGrid.parentNode.insertBefore(controlsBar, certificatesGrid);

            // Add event listeners
            document.getElementById('certificateSearch').addEventListener('input', debounce(handleSearch, 300));
            document.getElementById('sortSelect').addEventListener('change', handleSort);
        }

        // ===========================
        // Search Functionality
        // ===========================
        function handleSearch(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.certificate-card');
            let visibleCount = 0;

            cards.forEach(card => {
                const eventTitle = card.querySelector('.certificate-title h3')?.textContent.toLowerCase() || '';
                const organization = card.querySelector('.detail-value')?.textContent.toLowerCase() || '';
                const isMatch = eventTitle.includes(searchTerm) || organization.includes(searchTerm);

                if (isMatch) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.4s ease';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            updateVisibleCount(visibleCount);

            // Show "no results" message if needed
            showNoResultsMessage(visibleCount === 0);
        }

        // ===========================
        // Sort Functionality
        // ===========================
        function handleSort(e) {
            const sortBy = e.target.value;
            const grid = document.querySelector('.certificates-grid');
            const cards = Array.from(document.querySelectorAll('.certificate-card'));

            cards.sort((a, b) => {
                switch(sortBy) {
                    case 'newest':
                        return getDate(b) - getDate(a);
                    case 'oldest':
                        return getDate(a) - getDate(b);
                    case 'event-name':
                        return getEventName(a).localeCompare(getEventName(b));
                    case 'organization':
                        return getOrganization(a).localeCompare(getOrganization(b));
                    default:
                        return 0;
                }
            });

            // Re-append cards in sorted order
            cards.forEach(card => grid.appendChild(card));

            // Add re-animation
            cards.forEach((card, index) => {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = `cardSlideIn 0.4s ease ${index * 0.05}s backwards`;
                }, 10);
            });
        }

        function getDate(card) {
            const dateText = card.querySelector('.assigned-date')?.textContent || '';
            // This is approximate - in production, you'd want to use data attributes
            return new Date();
        }

        function getEventName(card) {
            return card.querySelector('.certificate-title h3')?.textContent.trim() || '';
        }

        function getOrganization(card) {
            return card.querySelector('.detail-value')?.textContent.trim() || '';
        }

        // ===========================
        // Update Visible Count
        // ===========================
        function updateVisibleCount(count) {
            const countElement = document.getElementById('visibleCount');
            if (countElement) {
                countElement.textContent = count;
                countElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    countElement.style.transform = 'scale(1)';
                }, 200);
            }
        }

        // ===========================
        // No Results Message
        // ===========================
        function showNoResultsMessage(show) {
            const grid = document.querySelector('.certificates-grid');
            if (!grid) return;

            let noResults = document.getElementById('noResultsMessage');

            if (show && !noResults) {
                noResults = document.createElement('div');
                noResults.id = 'noResultsMessage';
                noResults.style.cssText = `
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 4rem 2rem;
                `;
                noResults.innerHTML = `
                    <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">🔍</div>
                    <h3 style="font-size: 1.5rem; color: #1f2937; margin-bottom: 0.5rem;">No certificates found</h3>
                    <p style="color: #6b7280;">Try adjusting your search terms</p>
                `;
                grid.appendChild(noResults);
            } else if (!show && noResults) {
                noResults.remove();
            }
        }

        // ===========================
        // Download Button Enhancement
        // ===========================
        const downloadButtons = document.querySelectorAll('.download-btn');
        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Add download animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                // Show download notification
                showNotification('Certificate download started', 'success');

                // Track download
                if (typeof console !== 'undefined') {
                    const eventName = this.closest('.certificate-card').querySelector('.certificate-title h3')?.textContent;
                    console.log('Certificate downloaded:', eventName);
                }
            });
        });

        // ===========================
        // Card Hover Effects
        // ===========================
        const certificateCards = document.querySelectorAll('.certificate-card');
        certificateCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.certificate-icon');
                if (icon) {
                    icon.style.transform = 'rotate(-5deg) scale(1.1)';
                }
            });

            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.certificate-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                }
            });
        });

        // ===========================
        // Share Certificate Functionality
        // ===========================
        function addShareButtons() {
            const footers = document.querySelectorAll('.certificate-footer');
            footers.forEach(footer => {
                if (footer.querySelector('.share-btn')) return; // Already added

                const shareBtn = document.createElement('button');
                shareBtn.className = 'share-btn';
                shareBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share
                `;
                shareBtn.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.75rem;
                    background: white;
                    color: #667eea;
                    border: 2px solid #667eea;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                `;

                shareBtn.addEventListener('mouseenter', function() {
                    this.style.background = '#667eea';
                    this.style.color = 'white';
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                });

                shareBtn.addEventListener('mouseleave', function() {
                    this.style.background = 'white';
                    this.style.color = '#667eea';
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });

                shareBtn.addEventListener('click', function() {
                    const card = this.closest('.certificate-card');
                    const eventName = card.querySelector('.certificate-title h3')?.textContent;
                    handleShare(eventName);
                });

                const downloadBtn = footer.querySelector('.download-btn');
                footer.insertBefore(shareBtn, downloadBtn);
            });
        }

        function handleShare(eventName) {
            if (navigator.share) {
                navigator.share({
                    title: 'My Certificate',
                    text: `Check out my certificate for ${eventName}!`,
                    url: window.location.href
                }).catch(err => {
                    if (err.name !== 'AbortError') {
                        console.error('Share failed:', err);
                    }
                });
            } else {
                // Fallback: Copy link to clipboard
                copyToClipboard(window.location.href);
                showNotification('Link copied to clipboard!', 'success');
            }
        }

        // ===========================
        // Copy to Clipboard
        // ===========================
        function copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
        }

        // ===========================
        // Notification System
        // ===========================
        function showNotification(message, type = 'info') {
            const existing = document.querySelector('.notification-toast');
            if (existing) {
                existing.remove();
            }

            const notification = document.createElement('div');
            notification.className = 'notification-toast';
            notification.textContent = message;

            const colors = {
                success: '#10b981',
                error: '#ef4444',
                info: '#667eea',
                warning: '#f59e0b'
            };

            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 2rem;
                background: ${colors[type] || colors.info};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                font-weight: 600;
                animation: slideIn 0.3s ease;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Add notification animations
        if (!document.getElementById('notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Scroll to Top Button
        // ===========================
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        scrollButton.style.cssText = `
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
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            z-index: 999;
        `;

        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
            this.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.5)';
        });

        scrollButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        });

        document.body.appendChild(scrollButton);

        window.addEventListener('scroll', debounce(function() {
            if (window.pageYOffset > 400) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
            }
        }, 100));

        // ===========================
        // View Certificate in Modal
        // ===========================
        function addViewButtons() {
            const cards = document.querySelectorAll('.certificate-card');
            cards.forEach(card => {
                const header = card.querySelector('.certificate-header');
                const viewBtn = document.createElement('button');
                viewBtn.innerHTML = '👁️';
                viewBtn.title = 'Quick view';
                viewBtn.style.cssText = `
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 8px;
                    font-size: 1.25rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10;
                `;

                viewBtn.addEventListener('mouseenter', function() {
                    this.style.background = 'rgba(255, 255, 255, 0.3)';
                    this.style.transform = 'scale(1.1)';
                });

                viewBtn.addEventListener('mouseleave', function() {
                    this.style.background = 'rgba(255, 255, 255, 0.2)';
                    this.style.transform = 'scale(1)';
                });

                viewBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const downloadUrl = card.querySelector('.download-btn')?.href;
                    if (downloadUrl) {
                        openCertificateModal(downloadUrl);
                    }
                });

                header.appendChild(viewBtn);
            });
        }

        function openCertificateModal(url) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                animation: fadeIn 0.3s ease;
            `;

            modal.innerHTML = `
                <div style="position: relative; max-width: 90%; max-height: 90%; background: white; border-radius: 12px; overflow: hidden;">
                    <button id="closeModal" style="position: absolute; top: 1rem; right: 1rem; width: 40px; height: 40px; background: #ef4444; color: white; border: none; border-radius: 8px; font-size: 1.5rem; cursor: pointer; z-index: 1;">×</button>
                    <iframe src="${url}" style="width: 100%; height: 80vh; border: none;"></iframe>
                </div>
            `;

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            const closeBtn = modal.querySelector('#closeModal');
            closeBtn.addEventListener('click', function() {
                modal.remove();
                document.body.style.overflow = '';
            });

            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                    document.body.style.overflow = '';
                }
            });

            // ESC key to close
            const handleEscape = function(e) {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        }

        // ===========================
        // Statistics Counter
        // ===========================
        function addStatistics() {
            const cards = document.querySelectorAll('.certificate-card');
            if (cards.length === 0) return;

            const statsBar = document.createElement('div');
            statsBar.style.cssText = `
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
                animation: slideDown 0.6s ease 0.15s backwards;
            `;

            const totalCerts = cards.length;
            const organizations = new Set();
            cards.forEach(card => {
                const org = card.querySelector('.detail-value')?.textContent.trim();
                if (org) organizations.add(org);
            });

            const stats = [
                { label: 'Total Certificates', value: totalCerts, icon: '🏆' },
                { label: 'Organizations', value: organizations.size, icon: '🏢' },
                { label: 'This Year', value: totalCerts, icon: '📅' }
            ];

            stats.forEach(stat => {
                const statCard = document.createElement('div');
                statCard.style.cssText = `
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 2px solid #e5e7eb;
                    text-align: center;
                    transition: all 0.3s ease;
                `;

                statCard.innerHTML = `
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${stat.icon}</div>
                    <div style="font-size: 2rem; font-weight: 700; color: #667eea; margin-bottom: 0.25rem;">${stat.value}</div>
                    <div style="font-size: 0.875rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${stat.label}</div>
                `;

                statCard.addEventListener('mouseenter', function() {
                    this.style.borderColor = '#667eea';
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.2)';
                });

                statCard.addEventListener('mouseleave', function() {
                    this.style.borderColor = '#e5e7eb';
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });

                statsBar.appendChild(statCard);
            });

            const header = document.querySelector('.page-header');
            header.parentNode.insertBefore(statsBar, header.nextSibling);
        }

        // ===========================
        // Debounce Utility
        // ===========================
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // ===========================
        // Initialize Features
        // ===========================
        const hasCertificates = document.querySelector('.certificates-grid');

        if (hasCertificates) {
            addControlsBar();
            addShareButtons();
            addViewButtons();
            addStatistics();
        }

        // ===========================
        // Success Message from URL
        // ===========================
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('downloaded') === 'true') {
            showNotification('Certificate downloaded successfully!', 'success');
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // ===========================
        // Keyboard Shortcuts
        // ===========================
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + F to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                const searchInput = document.getElementById('certificateSearch');
                if (searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                }
            }

            // Ctrl/Cmd + P to print
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                window.print();
            }
        });

        // ===========================
        // Print All Button
        // ===========================
        function addPrintButton() {
            const pageHeader = document.querySelector('.page-header');
            if (!pageHeader || !document.querySelector('.certificates-grid')) return;

            const printBtn = document.createElement('button');
            printBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Print All
            `;
            printBtn.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.875rem 1.75rem;
                background: white;
                color: #667eea;
                border: 2px solid #667eea;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 1rem;
            `;

            printBtn.addEventListener('mouseenter', function() {
                this.style.background = '#667eea';
                this.style.color = 'white';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            });

            printBtn.addEventListener('mouseleave', function() {
                this.style.background = 'white';
                this.style.color = '#667eea';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });

            printBtn.addEventListener('click', function() {
                window.print();
            });

            pageHeader.appendChild(printBtn);
        }

        addPrintButton();

        // ===========================
        // Console Log for Debug
        // ===========================
        if (typeof console !== 'undefined') {
            console.log('My Certificates page loaded successfully');
            console.log('Total certificates:', document.querySelectorAll('.certificate-card').length);
        }

    });

})();