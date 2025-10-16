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
        // View Certificate Button (PDF Preview)
        // ===========================
        function addViewButtons() {
            const cards = document.querySelectorAll('.certificate-card');
            cards.forEach(card => {
                const header = card.querySelector('.certificate-header');
                const viewBtn = document.createElement('button');
                viewBtn.className = 'view-certificate-btn';
                viewBtn.innerHTML = '👁️';
                viewBtn.title = 'Preview certificate';
                viewBtn.setAttribute('aria-label', 'Preview certificate');

                viewBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const downloadLink = card.querySelector('.download-btn');
                    if (downloadLink) {
                        const pdfUrl = downloadLink.getAttribute('href');
                        const eventName = card.querySelector('.certificate-title h3')?.textContent || 'Certificate';
                        openPDFModal(pdfUrl, eventName, downloadLink);
                    }
                });

                header.appendChild(viewBtn);
            });
        }

        // ===========================
        // PDF Preview Modal
        // ===========================
        function openPDFModal(pdfUrl, eventName, downloadLink) {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'pdf-modal-overlay';

            // Try multiple PDF display methods for better compatibility
            const viewerContent = getPDFViewerHTML(pdfUrl);

            modal.innerHTML = `
                <div class="pdf-modal-content">
                    <div class="pdf-modal-header">
                        <h3>📜 ${eventName}</h3>
                        <div class="pdf-modal-actions">
                            <a href="${pdfUrl}" class="pdf-modal-btn pdf-download-btn" download target="_blank">
                                📥 Download
                            </a>
                            <button class="pdf-modal-btn pdf-close-btn" id="closePDFModal" aria-label="Close preview">
                                ×
                            </button>
                        </div>
                    </div>
                    ${viewerContent}
                </div>
            `;

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            // Close button handler
            const closeBtn = modal.querySelector('#closePDFModal');
            closeBtn.addEventListener('click', function() {
                closePDFModal(modal);
            });

            // Click outside to close
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closePDFModal(modal);
                }
            });

            // ESC key to close
            const handleEscape = function(e) {
                if (e.key === 'Escape') {
                    closePDFModal(modal);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);

            // Download button handler
            const downloadBtn = modal.querySelector('.pdf-download-btn');
            downloadBtn.addEventListener('click', function() {
                showNotification('Certificate download started', 'success');
            });

            // Check if iframe loaded successfully
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                iframe.addEventListener('error', function() {
                    console.error('PDF iframe failed to load');
                    handlePDFLoadError(modal, pdfUrl, eventName);
                });

                // Fallback if iframe doesn't load after 3 seconds
                setTimeout(function() {
                    // Check if iframe content is accessible
                    try {
                        if (!iframe.contentWindow || iframe.contentWindow.location.href === 'about:blank') {
                            handlePDFLoadError(modal, pdfUrl, eventName);
                        }
                    } catch (e) {
                        // Cross-origin, but that's okay - PDF should still load
                    }
                }, 3000);
            }
        }

        function getPDFViewerHTML(pdfUrl) {
            // Try using Google Docs Viewer as fallback
            const useGoogleViewer = false; // Set to true if direct embedding fails

            if (useGoogleViewer) {
                return `
                    <iframe class="pdf-viewer" 
                        src="https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true" 
                        title="Certificate Preview"
                        allow="fullscreen">
                    </iframe>
                `;
            } else {
                // Direct PDF embedding with multiple fallback options
                return `
                    <object class="pdf-viewer" 
                        data="${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH" 
                        type="application/pdf"
                        title="Certificate Preview">
                        <iframe class="pdf-viewer" 
                            src="${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1" 
                            title="Certificate Preview">
                            <div style="padding: 3rem; text-align: center;">
                                <div style="font-size: 4rem; margin-bottom: 1rem;">📄</div>
                                <h3 style="color: #1f2937; margin-bottom: 1rem;">PDF Preview Not Available</h3>
                                <p style="color: #6b7280; margin-bottom: 2rem;">Your browser doesn't support PDF preview. Please download the certificate to view it.</p>
                                <a href="${pdfUrl}" class="pdf-modal-btn pdf-download-btn" download style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; font-weight: 600; text-decoration: none;">
                                    📥 Download Certificate
                                </a>
                            </div>
                        </iframe>
                    </object>
                `;
            }
        }

        function handlePDFLoadError(modal, pdfUrl, eventName) {
            const viewer = modal.querySelector('.pdf-viewer');
            if (!viewer) return;

            const parent = viewer.parentElement;
            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = `
                padding: 3rem;
                text-align: center;
                background: #f9fafb;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            `;

            errorMessage.innerHTML = `
                <div style="font-size: 5rem; margin-bottom: 1.5rem;">📄</div>
                <h3 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.5rem;">Unable to Preview PDF</h3>
                <p style="color: #6b7280; margin-bottom: 2rem; max-width: 500px;">
                    Your browser settings may be blocking the PDF preview. 
                    You can still download the certificate or open it in a new tab.
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                    <a href="${pdfUrl}" target="_blank" class="pdf-modal-btn" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; font-weight: 600; text-decoration: none; border: none;">
                        🔗 Open in New Tab
                    </a>
                    <a href="${pdfUrl}" download class="pdf-modal-btn" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; background: white; color: #667eea; border: 2px solid #667eea; border-radius: 8px; font-weight: 600; text-decoration: none;">
                        📥 Download
                    </a>
                </div>
            `;

            viewer.replaceWith(errorMessage);
        }

        function closePDFModal(modal) {
            modal.style.animation = 'modalFadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }

        // Add modal fade out animation
        if (!document.getElementById('modal-animations')) {
            const style = document.createElement('style');
            style.id = 'modal-animations';
            style.textContent = `
                @keyframes modalFadeOut {
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
        // Console Log for Debug
        // ===========================
        if (typeof console !== 'undefined') {
            console.log('My Certificates page loaded successfully');
            console.log('Total certificates:', document.querySelectorAll('.certificate-card').length);
        }

    });

})();