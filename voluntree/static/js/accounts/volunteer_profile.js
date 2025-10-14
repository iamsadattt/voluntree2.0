// Volunteer Profile JavaScript
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Cache DOM Elements
        // ===========================
        const profilePicture = document.querySelector('.profile-picture');
        const profilePicturePlaceholder = document.querySelector('.profile-picture-placeholder');
        const statCards = document.querySelectorAll('.stat-card');
        const tags = document.querySelectorAll('.tag');
        const actionButtons = document.querySelectorAll('.profile-actions-row a');

        // ===========================
        // Profile Picture Enhancement
        // ===========================
        if (profilePicture) {
            profilePicture.addEventListener('load', function() {
                this.style.opacity = '1';
            });

            profilePicture.addEventListener('error', function() {
                // If image fails to load, show placeholder
                if (profilePicturePlaceholder) {
                    this.style.display = 'none';
                    profilePicturePlaceholder.style.display = 'flex';
                }
            });
        }

        // ===========================
        // Stats Counter Animation
        // ===========================
        function animateStats() {
            statCards.forEach(card => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const statValue = card.querySelector('.stat-value');
                            if (statValue && !statValue.classList.contains('animated')) {
                                animateValue(statValue);
                                statValue.classList.add('animated');
                            }
                        }
                    });
                }, { threshold: 0.5 });

                observer.observe(card);
            });
        }

        function animateValue(element) {
            const finalValue = parseInt(element.textContent);
            const duration = 2000;
            const step = finalValue / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= finalValue) {
                    element.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        }

        // Initialize stats animation
        animateStats();

        // ===========================
        // Tag Interactions
        // ===========================
        tags.forEach(tag => {
            tag.addEventListener('click', function() {
                // Add pulse animation on click
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });

            // Make tags more interactive
            tag.addEventListener('mouseenter', function() {
                this.style.cursor = 'pointer';
            });
        });

        // ===========================
        // Action Button Enhancements
        // ===========================
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Add loading state
                if (!this.classList.contains('loading')) {
                    this.classList.add('loading');

                    // Store original content
                    const originalHTML = this.innerHTML;

                    // Add loading spinner
                    this.innerHTML = `
                        <svg class="loading-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Loading...
                    `;

                    // Restore after 5 seconds (in case of error)
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.classList.remove('loading');
                    }, 5000);
                }
            });
        });

        // ===========================
        // Profile Header Scroll Effect
        // ===========================
        function handleProfileHeaderScroll() {
            const profileHeader = document.querySelector('.profile-header');
            const scrolled = window.pageYOffset > 100;

            if (profileHeader) {
                if (scrolled) {
                    profileHeader.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                } else {
                    profileHeader.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }
            }
        }

        window.addEventListener('scroll', debounce(handleProfileHeaderScroll, 10));

        // ===========================
        // Copy Contact Info
        // ===========================
        const contactItems = document.querySelectorAll('.contact-item');

        contactItems.forEach(item => {
            item.addEventListener('click', function() {
                const text = this.textContent.trim();
                copyToClipboard(text);

                // Show temporary feedback
                showCopyFeedback(this, 'Copied!');
            });
        });

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }

        function showCopyFeedback(element, message) {
            const originalContent = element.innerHTML;
            element.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>${message}</span>
            `;

            element.style.color = '#10b981';

            setTimeout(() => {
                element.innerHTML = originalContent;
                element.style.color = '';
            }, 2000);
        }

        // ===========================
        // Responsive Image Handling
        // ===========================
        function handleImageResponsiveness() {
            const images = document.querySelectorAll('.profile-picture');
            images.forEach(img => {
                // Ensure images don't break layout on small screens
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            });
        }

        // ===========================
        // Print Profile Functionality
        // ===========================
        function addPrintButton() {
            const printBtn = document.createElement('button');
            printBtn.className = 'btn-print-profile';
            printBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Print Profile
            `;

            printBtn.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: #6b7280;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s ease;
                margin-left: 1rem;
            `;

            printBtn.addEventListener('mouseenter', function() {
                this.style.background = '#4b5563';
            });

            printBtn.addEventListener('mouseleave', function() {
                this.style.background = '#6b7280';
            });

            printBtn.addEventListener('click', function() {
                window.print();
            });

            // Add to profile actions if user is viewing their own profile
            const profileActions = document.querySelector('.profile-actions');
            if (profileActions) {
                profileActions.appendChild(printBtn);
            }
        }

        // Uncomment to enable print functionality
        // addPrintButton();

        // ===========================
        // Helper Functions
        // ===========================
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

        // ===========================
        // Initialize
        // ===========================
        handleImageResponsiveness();
        handleProfileHeaderScroll();

        // ===========================
        // Console Message
        // ===========================
        console.log('%c👤 Volunteer Profile Loaded', 'color: #4f46e5; font-size: 16px; font-weight: bold;');

    });

})();

// Add CSS for loading spinner
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @media print {
        .profile-actions,
        .profile-actions-row,
        .btn-print-profile {
            display: none !important;
        }

        .profile-page {
            margin: 0;
            padding: 0;
            background: white;
        }

        .profile-header {
            box-shadow: none;
            border: 1px solid #ddd;
        }

        .stat-card {
            box-shadow: none;
            border: 1px solid #ddd;
        }

        .info-card {
            box-shadow: none;
            border: 1px solid #ddd;
        }
    }
`;
document.head.appendChild(style);