// Admin Event Detail page specific JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Staggered Card Animations
        // ===========================
        const detailCards = document.querySelectorAll('.detail-card');

        detailCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });

        // ===========================
        // Add Ripple Effect to Buttons
        // ===========================
        const buttons = document.querySelectorAll('.btn-secondary, .btn-download, .btn-approve, .btn-reject, .btn-reject-small, .btn-danger');

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
            }, 400 + (index * 50));
        });

        // Pulse animation for pending status
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
        // Tags Hover Animation
        // ===========================
        const tags = document.querySelectorAll('.tag');

        tags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px)';
            tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0)';
            }, 200 + (index * 50));
        });

        // ===========================
        // Table Row Animations
        // ===========================
        const tableRows = document.querySelectorAll('.admin-table tbody tr');

        tableRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, 300 + (index * 75));
        });

        // ===========================
        // Certificate Actions - Loading States
        // ===========================
        const certificateForms = document.querySelectorAll('form[action*="certificate"]');

        certificateForms.forEach(form => {
            form.addEventListener('submit', function() {
                const button = this.querySelector('button[type="submit"]');
                if (button) {
                    button.disabled = true;
                    const originalText = button.textContent;
                    button.textContent = '⏳ Processing...';
                    button.style.opacity = '0.7';
                }
            });
        });

        // ===========================
        // Certificate Download Tracking
        // ===========================
        const downloadButton = document.querySelector('.btn-download');
        if (downloadButton) {
            downloadButton.addEventListener('click', function() {
                showToast('Certificate download started', 'success');

                // Log download action
                if (typeof console !== 'undefined') {
                    console.log('Certificate downloaded at:', new Date().toISOString());
                }
            });
        }

        // ===========================
        // Info Item Hover Effect
        // ===========================
        const infoItems = document.querySelectorAll('.info-item');

        infoItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
                this.style.transition = 'transform 0.3s ease';
            });

            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });

        // ===========================
        // Event Image Zoom on Click
        // ===========================
        const eventImage = document.querySelector('.event-detail-image');
        if (eventImage) {
            eventImage.style.cursor = 'pointer';

            eventImage.addEventListener('click', function() {
                createImageModal(this.src, this.alt);
            });
        }

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
        }

        // ===========================
        // Copy Email on Click
        // ===========================
        const emailCells = document.querySelectorAll('.admin-table tbody td:nth-child(2)');

        emailCells.forEach(cell => {
            cell.style.cursor = 'pointer';
            cell.title = 'Click to copy email';

            cell.addEventListener('click', function(e) {
                if (e.target.tagName !== 'A') {
                    const email = this.textContent.trim();

                    navigator.clipboard.writeText(email).then(() => {
                        showToast('Email copied to clipboard!', 'success');
                        this.style.animation = 'flashGreen 0.5s ease';
                    }).catch(() => {
                        const textArea = document.createElement('textarea');
                        textArea.value = email;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        showToast('Email copied!', 'success');
                    });
                }
            });
        });

        if (!document.getElementById('flash-green-animation')) {
            const style = document.createElement('style');
            style.id = 'flash-green-animation';
            style.textContent = `
                @keyframes flashGreen {
                    0%, 100% {
                        background: transparent;
                    }
                    50% {
                        background: rgba(16, 185, 129, 0.2);
                    }
                }
            `;
            document.head.appendChild(style);
        }

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
        // Danger Zone Enhanced Confirmation
        // ===========================
        const deleteForm = document.querySelector('form[action*="delete"]');
        const dangerButton = document.querySelector('.btn-danger');

        if (deleteForm && dangerButton) {
            let clickCount = 0;
            let clickTimeout;

            dangerButton.addEventListener('click', function(e) {
                e.preventDefault();
                clickCount++;

                if (clickCount === 1) {
                    const originalText = this.textContent;
                    this.textContent = '⚠️ Click Again to Confirm Delete';
                    this.style.animation = 'intensePulse 0.5s ease';

                    clickTimeout = setTimeout(() => {
                        this.textContent = originalText;
                        clickCount = 0;
                        this.style.animation = '';
                    }, 3000);

                } else if (clickCount === 2) {
                    clearTimeout(clickTimeout);

                    if (confirm('Are you sure you want to delete this event? This action cannot be undone and will delete all registrations and certificates.')) {
                        this.disabled = true;
                        this.textContent = '🗑️ Deleting...';
                        this.style.opacity = '0.7';
                        deleteForm.submit();
                    } else {
                        this.textContent = '🗑️ Delete Event';
                        clickCount = 0;
                        this.style.animation = '';
                    }
                }
            });
        }

        if (!document.getElementById('intense-pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'intense-pulse-animation';
            style.textContent = `
                @keyframes intensePulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.6);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Certificate Card Highlight
        // ===========================
        const certificateCard = document.querySelector('.certificate-card');
        if (certificateCard) {
            const hasCertificate = certificateCard.querySelector('.certificate-details');
            if (hasCertificate) {
                certificateCard.style.borderColor = '#667eea';
                certificateCard.style.borderWidth = '2px';
            }
        }

        // ===========================
        // Scroll to Certificate Section from URL Hash
        // ===========================
        if (window.location.hash === '#certificate') {
            setTimeout(() => {
                if (certificateCard) {
                    certificateCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    certificateCard.style.animation = 'highlightPulse 1s ease';
                }
            }, 500);
        }

        if (!document.getElementById('highlight-pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'highlight-pulse-animation';
            style.textContent = `
                @keyframes highlightPulse {
                    0%, 100% {
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    }
                    50% {
                        box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Statistics Counter Animation
        // ===========================
        const registeredValue = document.querySelector('.info-item .info-label:contains("Registered")');
        if (registeredValue) {
            const valueEl = registeredValue.nextElementSibling;
            if (valueEl) {
                const targetValue = parseInt(valueEl.textContent);
                if (!isNaN(targetValue)) {
                    animateCounter(valueEl, targetValue);
                }
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
        // Keyboard Shortcuts
        // ===========================
        document.addEventListener('keydown', function(e) {
            // ESC to go back
            if (e.key === 'Escape') {
                const backButton = document.querySelector('.btn-secondary');
                if (backButton && !document.querySelector('.modal')) {
                    backButton.click();
                }
            }
        });

        // ===========================
        // Print Event Details
        // ===========================
        function printEventDetails() {
            window.print();
        }

        // Add print button if needed
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            const printBtn = document.createElement('button');
            printBtn.textContent = '🖨️ Print';
            printBtn.className = 'btn-secondary';
            printBtn.style.cssText = `
                padding: 0.75rem 1.5rem;
                background: white;
                color: #667eea;
                border: 2px solid #667eea;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            printBtn.addEventListener('click', printEventDetails);
            headerActions.appendChild(printBtn);
        }

        // ===========================
        // Log Page View
        // ===========================
        if (typeof console !== 'undefined') {
            const eventTitle = document.querySelector('.detail-header h1');
            if (eventTitle) {
                console.log('Admin Event Detail Viewed:', eventTitle.textContent);
            }
        }

    });

})();