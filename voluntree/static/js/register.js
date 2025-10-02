// Register Page JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Choice Card Interactions
        // ===========================
        const choiceCards = document.querySelectorAll('.choice-card');

        choiceCards.forEach(card => {
            // Add ripple effect on click
            card.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });

            // Add keyboard accessibility
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });

            // Add focus styles
            card.addEventListener('focus', function() {
                this.style.outline = '3px solid rgba(79, 70, 229, 0.5)';
                this.style.outlineOffset = '4px';
            });

            card.addEventListener('blur', function() {
                this.style.outline = 'none';
                this.style.outlineOffset = '0';
            });
        });

        // ===========================
        // Dynamic Card Sizing
        // ===========================
        function adjustCardHeights() {
            if (window.innerWidth > 768) {
                const cards = Array.from(choiceCards);

                // Reset heights
                cards.forEach(card => {
                    card.style.minHeight = 'auto';
                });

                // Get max height
                const heights = cards.map(card => card.offsetHeight);
                const maxHeight = Math.max(...heights);

                // Set equal heights
                cards.forEach(card => {
                    card.style.minHeight = maxHeight + 'px';
                });
            } else {
                // Reset on mobile
                choiceCards.forEach(card => {
                    card.style.minHeight = 'auto';
                });
            }
        }

        // Call on load and resize
        adjustCardHeights();

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(adjustCardHeights, 250);
        });

        // ===========================
        // Add Ripple CSS Dynamically
        // ===========================
        const style = document.createElement('style');
        style.textContent = `
            .choice-card {
                position: relative;
                overflow: hidden;
            }

            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(79, 70, 229, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }

            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .choice-card:focus-visible {
                outline: 3px solid rgba(79, 70, 229, 0.5);
                outline-offset: 4px;
            }
        `;
        document.head.appendChild(style);

        // ===========================
        // Parallax Effect on Mouse Move
        // ===========================
        const authPage = document.querySelector('.auth-page');

        if (authPage) {
            authPage.addEventListener('mousemove', function(e) {
                const cards = document.querySelectorAll('.choice-card');

                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const moveX = (x - centerX) / 30;
                    const moveY = (y - centerY) / 30;

                    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                        card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
                    }
                });
            });

            authPage.addEventListener('mouseleave', function() {
                const cards = document.querySelectorAll('.choice-card');
                cards.forEach(card => {
                    card.style.transform = '';
                });
            });
        }

        // ===========================
        // Feature Tags Animation
        // ===========================
        const featureTags = document.querySelectorAll('.feature-tag');

        featureTags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px)';
            tag.style.transition = 'all 0.3s ease';

            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0)';
            }, 600 + (index * 100));
        });

        // ===========================
        // Enhanced Hover Effects
        // ===========================
        choiceCards.forEach(card => {
            const button = card.querySelector('.choice-button');
            const icon = card.querySelector('.choice-icon');

            card.addEventListener('mouseenter', function() {
                if (icon) {
                    icon.style.animation = 'bounce 0.5s ease';
                }
            });

            card.addEventListener('mouseleave', function() {
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });

        // Add bounce animation
        const bounceStyle = document.createElement('style');
        bounceStyle.textContent = `
            @keyframes bounce {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.15);
                }
            }
        `;
        document.head.appendChild(bounceStyle);

        // ===========================
        // Smooth Scroll to Top on Page Load
        // ===========================
        window.scrollTo({ top: 0, behavior: 'instant' });

        // ===========================
        // Analytics Tracking (Optional)
        // ===========================
        choiceCards.forEach(card => {
            card.addEventListener('click', function() {
                const cardType = this.querySelector('h2').textContent;
                console.log(`User selected: ${cardType}`);

                // You can add analytics tracking here
                // Example: gtag('event', 'signup_choice', { choice: cardType });
            });
        });

        // ===========================
        // Accessibility Announcements
        // ===========================
        const announcer = document.createElement('div');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        document.body.appendChild(announcer);

        choiceCards.forEach(card => {
            card.addEventListener('focus', function() {
                const cardType = this.querySelector('h2').textContent;
                announcer.textContent = `${cardType} registration option focused. Press Enter to select.`;
            });
        });

        // ===========================
        // Console Welcome
        // ===========================
        console.log('%cRegister Page Loaded', 'color: #4f46e5; font-size: 16px; font-weight: bold;');
        console.log('Choose your account type to get started!');

    });

})();