// Login Page JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Cache DOM elements
        // ===========================
        const form = document.querySelector('.auth-form');
        const inputs = document.querySelectorAll('.form-group input');
        const submitBtn = document.querySelector('.btn-submit');
        const authCard = document.querySelector('.auth-card');

        // ===========================
        // Add entrance animation
        // ===========================
        if (authCard) {
            authCard.style.animation = 'none';
            setTimeout(() => {
                authCard.style.animation = '';
            }, 10);
        }

        // ===========================
        // Real-time Input Validation
        // ===========================
        inputs.forEach(input => {
            // Remove error state on focus
            input.addEventListener('focus', function() {
                this.classList.remove('error');
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.style.display = 'none';
                }
            });

            // Basic validation on blur
            input.addEventListener('blur', function() {
                validateInput(this);
            });

            // Clear error styling on input
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                }
            });
        });

        // ===========================
        // Input Validation Function
        // ===========================
        function validateInput(input) {
            const value = input.value.trim();
            const fieldName = input.getAttribute('name');

            // Username validation
            if (fieldName === 'username') {
                if (value === '') {
                    showInputError(input, 'Username is required');
                    return false;
                } else if (value.length < 3) {
                    showInputError(input, 'Username must be at least 3 characters');
                    return false;
                } else {
                    clearInputError(input);
                    input.classList.add('success');
                    return true;
                }
            }

            // Password validation
            if (fieldName === 'password') {
                if (value === '') {
                    showInputError(input, 'Password is required');
                    return false;
                } else if (value.length < 6) {
                    showInputError(input, 'Password must be at least 6 characters');
                    return false;
                } else {
                    clearInputError(input);
                    input.classList.add('success');
                    return true;
                }
            }

            return true;
        }

        function showInputError(input, message) {
            input.classList.add('error');
            input.classList.remove('success');

            let errorMsg = input.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                input.parentElement.appendChild(errorMsg);
            }

            errorMsg.textContent = message;
            errorMsg.style.display = 'block';
        }

        function clearInputError(input) {
            input.classList.remove('error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.style.display = 'none';
            }
        }

        // ===========================
        // Form Submit Validation
        // ===========================
        if (form) {
            form.addEventListener('submit', function(e) {
                let isValid = true;

                // Validate all inputs
                inputs.forEach(input => {
                    if (!validateInput(input)) {
                        isValid = false;
                    }
                });

                if (!isValid) {
                    e.preventDefault();

                    // Focus on first error
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.focus();
                    }

                    // Show notification
                    if (window.showNotification) {
                        window.showNotification('Please fix the errors in the form', 'error');
                    }

                    return false;
                }

                // Add loading state
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Signing In';
                submitBtn.disabled = true;
            });
        }

        // ===========================
        // Password Visibility Toggle
        // ===========================
        const passwordInput = document.querySelector('input[name="password"]');

        if (passwordInput) {
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'password-toggle';
            toggleBtn.innerHTML = '👁️';
            toggleBtn.setAttribute('aria-label', 'Toggle password visibility');

            passwordInput.parentElement.appendChild(toggleBtn);

            // Adjust input padding for toggle button
            passwordInput.style.paddingRight = '45px';

            toggleBtn.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type');
                if (type === 'password') {
                    passwordInput.setAttribute('type', 'text');
                    this.innerHTML = '🙈';
                } else {
                    passwordInput.setAttribute('type', 'password');
                    this.innerHTML = '👁️';
                }
            });
        }

        // ===========================
        // Auto-fill Detection
        // ===========================
        setTimeout(function() {
            inputs.forEach(input => {
                if (input.value) {
                    input.classList.add('success');
                }
            });
        }, 500);

        // ===========================
        // Enter Key Navigation
        // ===========================
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();

                    if (index < inputs.length - 1) {
                        // Move to next input
                        inputs[index + 1].focus();
                    } else {
                        // Submit form on last input
                        form.dispatchEvent(new Event('submit', { cancelable: true }));
                    }
                }
            });
        });

        // ===========================
        // Clear Form Errors from Server
        // ===========================
        const formErrors = document.querySelector('.form-errors');
        if (formErrors) {
            setTimeout(function() {
                formErrors.style.animation = 'shake 0.3s ease';
            }, 100);

            // Add close button to form errors
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.setAttribute('aria-label', 'Dismiss error');
            closeBtn.style.cssText = `
                float: right;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: inherit;
                opacity: 0.7;
                line-height: 1;
                padding: 0;
                margin: -2px 0 0 10px;
            `;

            closeBtn.addEventListener('click', function() {
                formErrors.style.display = 'none';
            });

            formErrors.insertBefore(closeBtn, formErrors.firstChild);
        }

        // ===========================
        // Focus First Input on Load
        // ===========================
        if (inputs.length > 0 && !inputs[0].value) {
            setTimeout(function() {
                inputs[0].focus();
            }, 300);
        }

        // ===========================
        // Prevent Multiple Submissions
        // ===========================
        let isSubmitting = false;

        if (form) {
            form.addEventListener('submit', function(e) {
                if (isSubmitting) {
                    e.preventDefault();
                    return false;
                }
                isSubmitting = true;

                // Reset after 10 seconds (safety net)
                setTimeout(function() {
                    isSubmitting = false;
                }, 10000);
            });
        }

        // ===========================
        // Card Hover Effect
        // ===========================
        if (authCard) {
            authCard.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.35)';
            });

            authCard.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        }

        // ===========================
        // Smooth Scroll to Top
        // ===========================
        window.scrollTo({ top: 0, behavior: 'instant' });

        // ===========================
        // Console Message
        // ===========================
        console.log('%cLogin Page Ready', 'color: #4f46e5; font-size: 16px; font-weight: bold;');

    });

})();