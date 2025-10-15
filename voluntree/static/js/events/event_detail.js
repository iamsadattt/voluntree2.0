// Event Detail page specific JavaScript

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

        // Observe sections with initial hidden state
        const animatedSections = document.querySelectorAll('.event-meta-grid, .event-description, .skills-container, .volunteers-section, .action-section');
        animatedSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(section);
        });

        // ===========================
        // Meta Cards Staggered Animation
        // ===========================
        const metaCards = document.querySelectorAll('.meta-card');

        const cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        metaCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            cardObserver.observe(card);
        });

        // ===========================
        // Skill Tags Staggered Animation
        // ===========================
        const skillTags = document.querySelectorAll('.skill-tag');

        const skillObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, index * 50);
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        skillTags.forEach(tag => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            skillObserver.observe(tag);
        });

        // ===========================
        // Volunteer Cards Staggered Animation
        // ===========================
        const volunteerCards = document.querySelectorAll('.volunteer-card');

        const volunteerObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 75);
                    volunteerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        volunteerCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            volunteerObserver.observe(card);
        });

        // ===========================
        // Add Ripple Effect to Buttons
        // ===========================
        const buttons = document.querySelectorAll('.btn-register, .btn-edit, .btn-manage, .btn-withdraw, .back-button');
        
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

        // Add ripple animation CSS if not exists
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
        // Smooth Scroll to Action Section
        // ===========================
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'register') {
            setTimeout(() => {
                const actionSection = document.querySelector('.action-section');
                if (actionSection) {
                    actionSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    actionSection.style.animation = 'pulse 1s ease';
                }
            }, 500);
        }

        // Add pulse animation CSS
        if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Status Badge Animation
        // ===========================
        const statusBadge = document.querySelector('.event-status-badge');
        if (statusBadge) {
            statusBadge.style.animation = 'bounceIn 0.6s ease 0.3s backwards';
        }

        if (!document.getElementById('bounceIn-animation')) {
            const style = document.createElement('style');
            style.id = 'bounceIn-animation';
            style.textContent = `
                @keyframes bounceIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% {
                        transform: scale(0.9);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // NGO Info Hover Effect
        // ===========================
        const ngoInfo = document.querySelector('.event-ngo-info');
        if (ngoInfo) {
            ngoInfo.addEventListener('mouseenter', function() {
                const logo = this.querySelector('.ngo-logo, .ngo-logo-placeholder');
                if (logo) {
                    logo.style.transform = 'scale(1.1) rotate(5deg)';
                    logo.style.transition = 'transform 0.3s ease';
                }
            });

            ngoInfo.addEventListener('mouseleave', function() {
                const logo = this.querySelector('.ngo-logo, .ngo-logo-placeholder');
                if (logo) {
                    logo.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        }

        // ===========================
        // Volunteers Counter Animation
        // ===========================
        const volunteersSection = document.querySelector('.volunteers-section');
        if (volunteersSection) {
            const sectionTitle = volunteersSection.querySelector('.section-title');
            if (sectionTitle) {
                const countMatch = sectionTitle.textContent.match(/\((\d+)\)/);
                if (countMatch) {
                    const targetCount = parseInt(countMatch[1]);
                    const observer = new IntersectionObserver(function(entries) {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                animateCounter(sectionTitle, targetCount);
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.5 });
                    observer.observe(volunteersSection);
                }
            }
        }

        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 30;
            const duration = 1000;
            const stepTime = duration / 30;
            const originalText = element.textContent;
            const prefix = originalText.split('(')[0];

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = `${prefix}(${target})`;
                    clearInterval(counter);
                } else {
                    element.textContent = `${prefix}(${Math.floor(current)})`;
                }
            }, stepTime);
        }

        // ===========================
        // Spots Available Progress Indicator
        // ===========================
        const spotsCard = Array.from(metaCards).find(card => {
            const title = card.querySelector('.meta-info h4');
            return title && title.textContent.includes('Spots Available');
        });

        if (spotsCard) {
            const spotsText = spotsCard.querySelector('.meta-info p');
            if (spotsText) {
                const spotsLeft = parseInt(spotsText.textContent);
                if (!isNaN(spotsLeft) && spotsLeft <= 10) {
                    spotsCard.style.borderColor = '#f59e0b';
                    spotsCard.querySelector('.meta-icon').style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                    
                    if (spotsLeft === 0) {
                        spotsCard.style.borderColor = '#ef4444';
                        spotsCard.querySelector('.meta-icon').style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                    }
                }
            }
        }

        // ===========================
        // Volunteers Needed Progress Bar
        // ===========================
        const volunteersCard = Array.from(metaCards).find(card => {
            const title = card.querySelector('.meta-info h4');
            return title && title.textContent.includes('Volunteers Needed');
        });

        if (volunteersCard) {
            const volunteersText = volunteersCard.querySelector('.meta-info p');
            if (volunteersText) {
                const match = volunteersText.textContent.match(/(\d+)\s*\/\s*(\d+)/);
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
                        margin-top: 8px;
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

                    progressBar.appendChild(progressFill);
                    volunteersCard.querySelector('.meta-info').appendChild(progressBar);

                    setTimeout(() => {
                        progressFill.style.width = `${percentage}%`;
                    }, 100);
                }
            }
        }

        // ===========================
        // Form Validation and Confirmation
        // ===========================
        const registerForm = document.querySelector('form[action*="event_register"]');
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                const button = this.querySelector('button[type="submit"]');
                if (button) {
                    button.disabled = true;
                    button.textContent = 'Registering...';
                    button.style.opacity = '0.7';
                }
            });
        }

        const withdrawForm = document.querySelector('form[action*="event_withdraw"]');
        if (withdrawForm) {
            const withdrawButton = withdrawForm.querySelector('.btn-withdraw');
            if (withdrawButton) {
                withdrawForm.addEventListener('submit', function(e) {
                    withdrawButton.disabled = true;
                    withdrawButton.textContent = 'Processing...';
                    withdrawButton.style.opacity = '0.7';
                });
            }
        }

        // ===========================
        // Add Hover Effect to Volunteer Avatars
        // ===========================
        const volunteerAvatars = document.querySelectorAll('.volunteer-avatar');
        volunteerAvatars.forEach(avatar => {
            avatar.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.2) rotate(360deg)';
                this.style.transition = 'transform 0.5s ease';
            });

            avatar.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });

        // ===========================
        // Status Message Animations
        // ===========================
        const statusMessages = document.querySelectorAll('.status-message');
        statusMessages.forEach((message, index) => {
            message.style.animation = `slideInLeft 0.6s ease ${index * 0.1}s backwards`;
        });

        if (!document.getElementById('slideInLeft-animation')) {
            const style = document.createElement('style');
            style.id = 'slideInLeft-animation';
            style.textContent = `
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Copy Event Link to Clipboard
        // ===========================
        const eventTitle = document.querySelector('.event-title');
        if (eventTitle) {
            eventTitle.style.cursor = 'pointer';
            eventTitle.title = 'Click to copy event link';

            eventTitle.addEventListener('click', function() {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                    showToast('Event link copied to clipboard!');
                }).catch(() => {
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showToast('Event link copied to clipboard!');
                });
            });
        }

        // Simple toast notification
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
        // Log page view (placeholder for analytics)
        // ===========================
        if (typeof console !== 'undefined') {
            const eventTitleEl = document.querySelector('.event-title');
            if (eventTitleEl) {
                console.log('Event Detail Viewed:', eventTitleEl.textContent);
            }
        }

    });

})();