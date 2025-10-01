// Base JavaScript - Common functionality for all pages

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Cache DOM elements
        // ===========================
        const navbar = document.querySelector('.navbar');
        const navContainer = document.querySelector('.nav-container');
        const navLinks = document.querySelector('.nav-links');
        const authButtons = document.querySelector('.auth-buttons');

        // ===========================
        // Navbar Scroll Effect
        // ===========================
        function handleScroll() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        // ===========================
        // Mobile Menu Toggle
        // ===========================
        const mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.className = 'mobile-menu-toggle';
        mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.innerHTML = '<span></span><span></span><span></span>';

        // Insert mobile menu toggle before auth buttons
        if (navLinks && navContainer) {
            navContainer.insertBefore(mobileMenuToggle, authButtons);
        }

        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = this.classList.toggle('active');
            navLinks.classList.toggle('active');
            this.setAttribute('aria-expanded', isActive);
        });

        // Close mobile menu when clicking a link
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('active') &&
                !navContainer.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            }, 250);
        });

        // ===========================
        // Auto-dismiss Messages
        // ===========================
        const messages = document.querySelectorAll('.alert');

        messages.forEach(function(message) {
            // Auto-dismiss after 5 seconds
            const dismissTimeout = setTimeout(function() {
                dismissMessage(message);
            }, 5000);

            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.className = 'alert-close';
            closeBtn.setAttribute('aria-label', 'Close message');
            closeBtn.style.cssText = `
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 0.75rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: inherit;
                opacity: 0.5;
                transition: opacity 0.2s;
                line-height: 1;
                padding: 0;
                width: 24px;
                height: 24px;
            `;

            closeBtn.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
            });

            closeBtn.addEventListener('mouseleave', function() {
                this.style.opacity = '0.5';
            });

            closeBtn.addEventListener('click', function() {
                clearTimeout(dismissTimeout);
                dismissMessage(message);
            });

            message.appendChild(closeBtn);
        });

        function dismissMessage(message) {
            message.classList.add('removing');
            setTimeout(function() {
                message.remove();
            }, 300);
        }

        // ===========================
        // Smooth Scroll for Anchor Links
        // ===========================
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href === '#' || href === '') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });

        // ===========================
        // Active Navigation Link
        // ===========================
        function setActiveNavLink() {
            const currentPath = window.location.pathname;
            const currentHash = window.location.hash;

            navLinksItems.forEach(link => {
                link.classList.remove('active');

                const linkPath = link.getAttribute('href');

                // Check for hash links
                if (currentHash && linkPath === currentHash) {
                    link.classList.add('active');
                    return;
                }

                // Check if link matches current path
                if (linkPath === currentPath) {
                    link.classList.add('active');
                }

                // Special case for home page
                if (currentPath === '/' && (linkPath === '/' || linkPath.includes('landing'))) {
                    link.classList.add('active');
                }
            });
        }

        setActiveNavLink();

        // Update active link on hash change
        window.addEventListener('hashchange', setActiveNavLink);

        // ===========================
        // Form Enhancement
        // ===========================
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Add loading state on submit
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn && !submitBtn.classList.contains('loading')) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;

                    // Store original text
                    const originalText = submitBtn.textContent || submitBtn.value;

                    // Change text to loading
                    if (submitBtn.tagName === 'BUTTON') {
                        submitBtn.textContent = 'Loading...';
                    } else {
                        submitBtn.value = 'Loading...';
                    }

                    // Restore after 10 seconds (in case of error)
                    setTimeout(function() {
                        if (submitBtn.tagName === 'BUTTON') {
                            submitBtn.textContent = originalText;
                        } else {
                            submitBtn.value = originalText;
                        }
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }, 10000);
                }
            });

            // Clear validation errors on input
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    if (this.style.borderColor === 'rgb(239, 68, 68)') {
                        this.style.borderColor = '';
                    }

                    // Remove error message if exists
                    const errorMsg = this.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.style.display = 'none';
                    }
                });
            });
        });

        // ===========================
        // Prevent Double Click on Buttons
        // ===========================
        const buttons = document.querySelectorAll('button, .btn');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (this.classList.contains('loading')) {
                    e.preventDefault();
                    return false;
                }
            });
        });

        // ===========================
        // Confirmation Dialogs
        // ===========================
        const confirmLinks = document.querySelectorAll('[data-confirm]');

        confirmLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const message = this.getAttribute('data-confirm');
                if (!confirm(message)) {
                    e.preventDefault();
                    return false;
                }
            });
        });

        // ===========================
        // Back to Top Button
        // ===========================
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');

        document.body.appendChild(backToTopBtn);

        // Show/hide back to top button
        const toggleBackToTop = debounce(function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', toggleBackToTop);

        // Scroll to top on click
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // ===========================
        // Keyboard Navigation Enhancement
        // ===========================
        document.addEventListener('keydown', function(e) {
            // ESC key closes mobile menu
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // ===========================
        // Console Welcome Message
        // ===========================
        console.log('%cVoluntree 🌳', 'color: #4f46e5; font-size: 24px; font-weight: bold;');
        console.log('%cWelcome to Voluntree - Volunteer Management Platform', 'color: #6b7280; font-size: 14px;');

    });

    // ===========================
    // Global Helper Functions
    // ===========================

    // CSRF Token Helper for AJAX
    window.getCSRFToken = function() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : '';
    };

    // Show notification
    window.showNotification = function(message, type = 'info') {
        const messagesContainer = document.querySelector('.messages-container') || createMessagesContainer();

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        messagesContainer.appendChild(alert);

        // Trigger animation
        setTimeout(() => {
            alert.style.animation = 'slideIn 0.3s ease';
        }, 10);

        // Auto dismiss
        setTimeout(() => {
            alert.classList.add('removing');
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    };

    function createMessagesContainer() {
        const container = document.createElement('div');
        container.className = 'messages-container';
        document.body.appendChild(container);
        return container;
    }

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

    window.debounce = debounce;

})();