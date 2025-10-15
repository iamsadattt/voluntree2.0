// Event Confirm Delete page specific JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Add Ripple Effect to Buttons
        // ===========================
        const buttons = document.querySelectorAll('.btn-cancel, .btn-delete-confirm, .back-button');

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
        // Delete Button Confirmation and Loading State
        // ===========================
        const deleteForm = document.querySelector('form');
        const deleteButton = document.querySelector('.btn-delete-confirm');

        if (deleteForm && deleteButton) {
            let clickCount = 0;
            let clickTimeout;

            deleteButton.addEventListener('click', function(e) {
                clickCount++;

                if (clickCount === 1) {
                    e.preventDefault();

                    // Change button text for second confirmation
                    const originalText = this.textContent;
                    this.textContent = 'Click Again to Confirm';
                    this.style.animation = 'intensePulse 0.5s ease';

                    // Reset after 3 seconds
                    clickTimeout = setTimeout(() => {
                        this.textContent = originalText;
                        clickCount = 0;
                        this.style.animation = '';
                    }, 3000);

                } else if (clickCount === 2) {
                    // Second click - show loading state and submit
                    clearTimeout(clickTimeout);
                    this.disabled = true;
                    this.classList.add('loading');
                    this.textContent = 'Deleting...';
                    this.style.opacity = '0.7';

                    // Let the form submit naturally
                }
            });
        }

        // Add intense pulse animation
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
        // Warning Icon Animation on Hover
        // ===========================
        const warningIcon = document.querySelector('.warning-icon');
        if (warningIcon) {
            warningIcon.addEventListener('mouseenter', function() {
                this.style.animation = 'none';
                this.style.transform = 'scale(1.2) rotate(15deg)';
                this.style.transition = 'transform 0.3s ease';
            });

            warningIcon.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
                setTimeout(() => {
                    this.style.animation = 'warningPulse 2s ease-in-out infinite';
                }, 300);
            });
        }

        // ===========================
        // Event Info Card Hover Effect
        // ===========================
        const eventInfo = document.querySelector('.event-info');
        if (eventInfo) {
            eventInfo.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                this.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
                this.style.transition = 'all 0.3s ease';
            });

            eventInfo.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.borderColor = 'rgba(102, 126, 234, 0.1)';
                this.style.boxShadow = 'none';
            });
        }

        // ===========================
        // Warning Message Shake on Hover
        // ===========================
        const warningMessage = document.querySelector('.warning-message');
        if (warningMessage) {
            warningMessage.addEventListener('mouseenter', function() {
                this.style.animation = 'shake 0.5s ease';
            });

            warningMessage.addEventListener('animationend', function() {
                this.style.animation = '';
            });
        }

        // ===========================
        // Keyboard Shortcuts
        // ===========================
        document.addEventListener('keydown', function(e) {
            // ESC key to cancel
            if (e.key === 'Escape') {
                e.preventDefault();
                const cancelButton = document.querySelector('.btn-cancel');
                if (cancelButton) {
                    cancelButton.click();
                }
            }

            // Prevent accidental Enter key submission
            if (e.key === 'Enter' && !e.shiftKey) {
                const activeElement = document.activeElement;
                if (activeElement.tagName !== 'BUTTON') {
                    e.preventDefault();
                    showToast('Please click the Delete button to confirm');
                }
            }
        });

        // ===========================
        // Toast Notification Function
        // ===========================
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.textContent = message;

            let backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            if (type === 'warning') {
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
        // Prevent Multiple Submissions
        // ===========================
        if (deleteForm) {
            deleteForm.addEventListener('submit', function(e) {
                const submitButton = this.querySelector('.btn-delete-confirm');
                if (submitButton && submitButton.disabled) {
                    e.preventDefault();
                    return false;
                }
            });
        }

        // ===========================
        // Countdown Timer (Optional Warning)
        // ===========================
        function startDeletionCountdown() {
            let timeLeft = 5;
            const countdownEl = document.createElement('div');
            countdownEl.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                padding: 2rem 3rem;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(239, 68, 68, 0.4);
                z-index: 10000;
                font-size: 2rem;
                font-weight: 700;
                text-align: center;
                animation: scaleIn 0.3s ease;
            `;
            countdownEl.textContent = `Deleting in ${timeLeft}...`;

            document.body.appendChild(countdownEl);

            const countdownInterval = setInterval(() => {
                timeLeft--;
                countdownEl.textContent = `Deleting in ${timeLeft}...`;

                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    countdownEl.remove();
                    if (deleteForm) {
                        deleteForm.submit();
                    }
                }
            }, 1000);

            // Cancel countdown if user clicks anywhere
            document.addEventListener('click', function cancelCountdown(e) {
                if (e.target !== deleteButton) {
                    clearInterval(countdownInterval);
                    countdownEl.remove();
                    document.removeEventListener('click', cancelCountdown);
                    showToast('Deletion cancelled', 'info');
                }
            });
        }

        // ===========================
        // Add Confirmation Dialog Enhancement
        // ===========================
        const cancelButton = document.querySelector('.btn-cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', function(e) {
                // Optional: Add a subtle confirmation for cancellation
                const eventTitle = document.querySelector('.event-info h3');
                if (eventTitle) {
                    console.log('Deletion cancelled for:', eventTitle.textContent);
                }
            });
        }

        // ===========================
        // Focus Management
        // ===========================
        // Focus on cancel button by default for safety
        if (cancelButton) {
            setTimeout(() => {
                cancelButton.focus();
            }, 100);
        }

        // ===========================
        // Visual Feedback for Dangerous Action
        // ===========================
        const confirmCard = document.querySelector('.confirm-card');
        if (confirmCard && deleteButton) {
            deleteButton.addEventListener('mouseenter', function() {
                confirmCard.style.borderColor = '#ef4444';
                confirmCard.style.boxShadow = '0 20px 60px rgba(239, 68, 68, 0.2)';
                confirmCard.style.transition = 'all 0.3s ease';
            });

            deleteButton.addEventListener('mouseleave', function() {
                confirmCard.style.borderColor = '#e5e7eb';
                confirmCard.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.1)';
            });
        }

        // ===========================
        // Log Page View
        // ===========================
        if (typeof console !== 'undefined') {
            const eventTitle = document.querySelector('.event-info h3');
            if (eventTitle) {
                console.log('Delete Confirmation Page Viewed:', eventTitle.textContent);
            }
        }

        // ===========================
        // Accessibility: Announce to screen readers
        // ===========================
        const announceEl = document.createElement('div');
        announceEl.setAttribute('role', 'alert');
        announceEl.setAttribute('aria-live', 'assertive');
        announceEl.className = 'sr-only';
        announceEl.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        `;
        announceEl.textContent = 'Warning: You are about to permanently delete an event. This action cannot be undone.';
        document.body.appendChild(announceEl);

    });

})();