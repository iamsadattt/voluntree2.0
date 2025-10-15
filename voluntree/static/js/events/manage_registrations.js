// Manage Registrations page specific JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Intersection Observer for Fade-in Animations
        // ===========================
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // ===========================
        // Registration Cards Staggered Animation
        // ===========================
        const registrationCards = document.querySelectorAll('.registration-card');

        registrationCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // ===========================
        // Summary Items Animation
        // ===========================
        const summaryItems = document.querySelectorAll('.summary-item');

        summaryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 300 + (index * 100));
        });

        // ===========================
        // Animate Summary Values Counter
        // ===========================
        summaryItems.forEach(item => {
            const valueEl = item.querySelector('.value');
            if (valueEl) {
                const text = valueEl.textContent.trim();
                const numbers = text.match(/\d+/g);

                if (numbers && numbers.length > 0) {
                    const targetNumber = parseInt(numbers[0]);
                    animateValue(valueEl, 0, targetNumber, 1000, text);
                }
            }
        });

        function animateValue(element, start, end, duration, originalText) {
            const range = end - start;
            const increment = range / 60;
            const stepTime = duration / 60;
            let current = start;

            const counter = setInterval(() => {
                current += increment;
                if (current >= end) {
                    element.textContent = originalText;
                    clearInterval(counter);
                } else {
                    const currentInt = Math.floor(current);
                    element.textContent = originalText.replace(/\d+/, currentInt);
                }
            }, stepTime);
        }

        // ===========================
        // Add Ripple Effect to Buttons
        // ===========================
        const buttons = document.querySelectorAll('.btn-view-profile, .btn-approve, .btn-reject, .back-button');

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
        // Volunteer Avatar Hover Effect
        // ===========================
        const avatars = document.querySelectorAll('.volunteer-avatar');
        avatars.forEach(avatar => {
            avatar.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.15) rotate(5deg)';
                this.style.transition = 'transform 0.3s ease';
            });

            avatar.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });

        // ===========================
        // Form Button Loading State
        // ===========================
        const approveForms = document.querySelectorAll('form[action*="approve_registration"]');
        const rejectForms = document.querySelectorAll('form[action*="reject_registration"]');

        approveForms.forEach(form => {
            form.addEventListener('submit', function() {
                const button = this.querySelector('.btn-approve');
                if (button) {
                    button.disabled = true;
                    button.innerHTML = '⏳ Approving...';
                    button.style.opacity = '0.7';
                }
            });
        });

        rejectForms.forEach(form => {
            form.addEventListener('submit', function() {
                const button = this.querySelector('.btn-reject');
                if (button) {
                    button.disabled = true;
                    button.innerHTML = '⏳ Rejecting...';
                    button.style.opacity = '0.7';
                }
            });
        });

        // ===========================
        // Status Badge Pulse Animation
        // ===========================
        const statusBadges = document.querySelectorAll('.status-badge.status-pending');
        statusBadges.forEach((badge, index) => {
            setTimeout(() => {
                badge.style.animation = 'subtlePulse 2s ease-in-out infinite';
            }, index * 200);
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
        // Card Hover Highlight Effect
        // ===========================
        registrationCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.borderColor = '#667eea';
            });

            card.addEventListener('mouseleave', function() {
                if (this.classList.contains('status-pending')) {
                    this.style.borderColor = '';
                } else if (this.classList.contains('status-approved')) {
                    this.style.borderColor = '';
                } else if (this.classList.contains('status-rejected')) {
                    this.style.borderColor = '';
                }
            });
        });

        // ===========================
        // Email Click to Copy
        // ===========================
        const emailElements = document.querySelectorAll('.volunteer-details .email');
        emailElements.forEach(email => {
            email.style.cursor = 'pointer';
            email.title = 'Click to copy email';

            email.addEventListener('click', function(e) {
                e.preventDefault();
                const emailText = this.textContent.trim();

                navigator.clipboard.writeText(emailText).then(() => {
                    showToast('Email copied to clipboard!');
                    this.style.animation = 'flashGreen 0.5s ease';
                }).catch(() => {
                    const textArea = document.createElement('textarea');
                    textArea.value = emailText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showToast('Email copied to clipboard!');
                });
            });
        });

        if (!document.getElementById('flash-green-animation')) {
            const style = document.createElement('style');
            style.id = 'flash-green-animation';
            style.textContent = `
                @keyframes flashGreen {
                    0%, 100% {
                        color: #667eea;
                    }
                    50% {
                        color: #10b981;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Phone Click to Copy
        // ===========================
        const phoneElements = document.querySelectorAll('.volunteer-details .phone');
        phoneElements.forEach(phone => {
            phone.style.cursor = 'pointer';
            phone.title = 'Click to copy phone number';

            phone.addEventListener('click', function(e) {
                e.preventDefault();
                const phoneText = this.textContent.trim().replace('📞 ', '');

                navigator.clipboard.writeText(phoneText).then(() => {
                    showToast('Phone number copied to clipboard!');
                    this.style.animation = 'flashGreen 0.5s ease';
                }).catch(() => {
                    const textArea = document.createElement('textarea');
                    textArea.value = phoneText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showToast('Phone number copied!');
                });
            });
        });

        // ===========================
        // Toast Notification Function
        // ===========================
        function showToast(message) {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
                z-index: 9999;
                font-weight: 600;
                animation: slideInUp 0.3s ease;
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
        // Quick Filter by Status
        // ===========================
        const filterButtons = document.createElement('div');
        filterButtons.className = 'filter-buttons';
        filterButtons.style.cssText = `
            display: flex;
            gap: 0.75rem;
            margin-bottom: 2rem;
            justify-content: center;
            flex-wrap: wrap;
        `;

        const statuses = ['all', 'pending', 'approved', 'rejected'];
        const statusLabels = {
            all: 'All',
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected'
        };

        if (registrationCards.length > 0) {
            statuses.forEach(status => {
                const btn = document.createElement('button');
                btn.textContent = statusLabels[status];
                btn.className = `filter-btn ${status === 'all' ? 'active' : ''}`;
                btn.dataset.status = status;
                btn.style.cssText = `
                    padding: 0.625rem 1.25rem;
                    border-radius: 8px;
                    border: 2px solid #e5e7eb;
                    background: white;
                    color: #4b5563;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;

                if (status === 'all') {
                    btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    btn.style.color = 'white';
                    btn.style.borderColor = '#667eea';
                }

                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(b => {
                        b.classList.remove('active');
                        b.style.background = 'white';
                        b.style.color = '#4b5563';
                        b.style.borderColor = '#e5e7eb';
                    });

                    this.classList.add('active');
                    this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    this.style.color = 'white';
                    this.style.borderColor = '#667eea';

                    filterCards(status);
                });

                btn.addEventListener('mouseenter', function() {
                    if (!this.classList.contains('active')) {
                        this.style.borderColor = '#667eea';
                        this.style.transform = 'translateY(-2px)';
                    }
                });

                btn.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('active')) {
                        this.style.borderColor = '#e5e7eb';
                        this.style.transform = 'translateY(0)';
                    }
                });

                filterButtons.appendChild(btn);
            });

            const registrationsList = document.querySelector('.registrations-list');
            if (registrationsList) {
                registrationsList.parentNode.insertBefore(filterButtons, registrationsList);
            }
        }

        function filterCards(status) {
            registrationCards.forEach((card, index) => {
                if (status === 'all' || card.classList.contains(`status-${status}`)) {
                    setTimeout(() => {
                        card.style.display = 'grid';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';

                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        }

        // ===========================
        // Keyboard Shortcuts
        // ===========================
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + F to focus on filter
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                const firstFilterBtn = document.querySelector('.filter-btn');
                if (firstFilterBtn) {
                    firstFilterBtn.focus();
                    firstFilterBtn.style.animation = 'pulse 0.5s ease';
                }
            }
        });

        if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 0 15px rgba(102, 126, 234, 0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Count and Display Statistics
        // ===========================
        function updateStatistics() {
            const pendingCount = document.querySelectorAll('.registration-card.status-pending').length;
            const approvedCount = document.querySelectorAll('.registration-card.status-approved').length;
            const rejectedCount = document.querySelectorAll('.registration-card.status-rejected').length;

            if (typeof console !== 'undefined') {
                console.log('Registration Stats:', {
                    pending: pendingCount,
                    approved: approvedCount,
                    rejected: rejectedCount,
                    total: pendingCount + approvedCount + rejectedCount
                });
            }
        }

        updateStatistics();

        // ===========================
        // Auto-refresh notification
        // ===========================
        let lastRefreshTime = Date.now();

        function checkForUpdates() {
            const currentTime = Date.now();
            const timeSinceRefresh = currentTime - lastRefreshTime;

            // Show refresh prompt after 5 minutes
            if (timeSinceRefresh > 300000) {
                const refreshPrompt = document.createElement('div');
                refreshPrompt.style.cssText = `
                    position: fixed;
                    top: 90px;
                    right: 2rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                    z-index: 9998;
                    font-weight: 600;
                    cursor: pointer;
                    animation: slideInDown 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                `;
                refreshPrompt.innerHTML = '🔄 New applications may be available. Click to refresh.';

                refreshPrompt.addEventListener('click', function() {
                    window.location.reload();
                });

                document.body.appendChild(refreshPrompt);

                setTimeout(() => {
                    refreshPrompt.style.animation = 'slideOutUp 0.3s ease';
                    setTimeout(() => refreshPrompt.remove(), 300);
                }, 10000);

                lastRefreshTime = currentTime;
            }
        }

        // Check every minute
        setInterval(checkForUpdates, 60000);

        if (!document.getElementById('slide-animations')) {
            const style = document.createElement('style');
            style.id = 'slide-animations';
            style.textContent = `
                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideOutUp {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Smooth Scroll to Top Button
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
            z-index: 9997;
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
            const eventTitle = document.querySelector('.page-header h2');
            if (eventTitle) {
                console.log('Manage Registrations Page Viewed:', eventTitle.textContent);
            }
        }

    });

})();