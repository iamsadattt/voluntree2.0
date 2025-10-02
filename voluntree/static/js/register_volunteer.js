// Volunteer Registration Page JavaScript

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
        const usernameInput = document.querySelector('input[name="username"]');
        const emailInput = document.querySelector('input[name="email"]');
        const phoneInput = document.querySelector('input[name="phone"]');
        const dobInput = document.querySelector('input[name="date_of_birth"]');
        const password1Input = document.querySelector('input[name="password1"]');
        const password2Input = document.querySelector('input[name="password2"]');

        // ===========================
        // Add entrance animation
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
        // Input Validation Functions
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
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    showInputError(input, 'Username can only contain letters, numbers, and underscores');
                    return false;
                } else {
                    clearInputError(input);
                    input.classList.add('success');
                    return true;
                }
            }

            // Email validation
            if (fieldName === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value === '') {
                    showInputError(input, 'Email is required');
                    return false;
                } else if (!emailRegex.test(value)) {
                    showInputError(input, 'Please enter a valid email address');
                    return false;
                } else {
                    clearInputError(input);
                    input.classList.add('success');
                    return true;
                }
            }

            // Phone validation (optional field)
            if (fieldName === 'phone' && value !== '') {
                const phoneRegex = /^[\d\s\+\-\(\)]+$/;
                if (!phoneRegex.test(value)) {
                    showInputError(input, 'Please enter a valid phone number');
                    return false;
                } else {
                    clearInputError(input);
                    input.classList.add('success');
                    return true;
                }
            }

            // Date of birth validation (optional field)
            if (fieldName === 'date_of_birth' && value !== '') {
                const dob = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - dob.getFullYear();

                if (age < 13) {
                    showInputError(input, 'You must be at least 13 years old');
                    return false;
                } else if (age > 120) {
                    showInputError(input, 'Please enter a valid date of birth');
                    return false;
                } else {
                    clearInputError(input);
                    input.classList.add('success');
                    return true;
                }
            }

            // Password validation
            if (fieldName === 'password1') {
                if (value === '') {
                    showInputError(input, 'Password is required');
                    return false;
                } else if (value.length < 8) {
                    showInputError(input, 'Password must be at least 8 characters');
                    return false;
                } else {
                    clearInputError(input);
                    input.classList.add('success');
                    return true;
                }
            }

            // Confirm password validation
            if (fieldName === 'password2') {
                const password1 = document.querySelector('input[name="password1"]').value;
                if (value === '') {
                    showInputError(input, 'Please confirm your password');
                    return false;
                } else if (value !== password1) {
                    showInputError(input, 'Passwords do not match');
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
        // Password Strength Indicator
        // ===========================
        if (password1Input) {
            const strengthContainer = document.createElement('div');
            strengthContainer.className = 'password-strength';

            const strengthBar = document.createElement('div');
            strengthBar.className = 'password-strength-bar';

            const strengthText = document.createElement('div');
            strengthText.className = 'password-strength-text';

            strengthContainer.appendChild(strengthBar);

            const helpText = password1Input.parentElement.querySelector('.form-help');
            if (helpText) {
                helpText.parentElement.insertBefore(strengthContainer, helpText.nextSibling);
                helpText.parentElement.insertBefore(strengthText, strengthContainer.nextSibling);
            }

            password1Input.addEventListener('input', function() {
                const password = this.value;
                const strength = calculatePasswordStrength(password);

                strengthBar.className = 'password-strength-bar';
                strengthText.className = 'password-strength-text';

                if (password.length === 0) {
                    strengthBar.style.width = '0';
                    strengthText.textContent = '';
                } else if (strength < 3) {
                    strengthBar.classList.add('weak');
                    strengthText.classList.add('weak');
                    strengthText.textContent = 'Weak password';
                } else if (strength < 4) {
                    strengthBar.classList.add('medium');
                    strengthText.classList.add('medium');
                    strengthText.textContent = 'Medium password';
                } else {
                    strengthBar.classList.add('strong');
                    strengthText.classList.add('strong');
                    strengthText.textContent = 'Strong password';
                }
            });
        }

        function calculatePasswordStrength(password) {
            let strength = 0;

            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
            if (/\d/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;

            return strength;
        }

        // ===========================
        // Password Visibility Toggles
        // ===========================
        function addPasswordToggle(passwordInput) {
            if (!passwordInput) return;

            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'password-toggle';
            toggleBtn.innerHTML = '👁️';
            toggleBtn.setAttribute('aria-label', 'Toggle password visibility');

            passwordInput.parentElement.appendChild(toggleBtn);
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

        addPasswordToggle(password1Input);
        addPasswordToggle(password2Input);

        // ===========================
        // Confirm Password Real-time Check
        // ===========================
        if (password2Input && password1Input) {
            password2Input.addEventListener('input', function() {
                if (this.value && password1Input.value) {
                    validateInput(this);
                }
            });
        }

        // ===========================
        // Form Submit Validation
        // ===========================
        if (form) {
            form.addEventListener('submit', function(e) {
                let isValid = true;

                // Validate all required inputs
                inputs.forEach(input => {
                    const isRequired = input.getAttribute('name') === 'username' ||
                                     input.getAttribute('name') === 'email' ||
                                     input.getAttribute('name') === 'password1' ||
                                     input.getAttribute('name') === 'password2';

                    if (isRequired || input.value.trim() !== '') {
                        if (!validateInput(input)) {
                            isValid = false;
                        }
                    }
                });

                if (!isValid) {
                    e.preventDefault();

                    // Focus on first error
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.focus();
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Show notification
                    if (window.showNotification) {
                        window.showNotification('Please fix the errors in the form', 'error');
                    }

                    return false;
                }

                // Add loading state
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Creating Account';
                submitBtn.disabled = true;
            });
        }

        // ===========================
        // Date Input Enhancement
        // ===========================
        if (dobInput) {
            // Set max date to today
            const today = new Date().toISOString().split('T')[0];
            dobInput.setAttribute('max', today);

            // Set placeholder
            dobInput.setAttribute('placeholder', 'YYYY-MM-DD');
        }

        // ===========================
        // Phone Input Formatting
        // ===========================
        if (phoneInput) {
            phoneInput.setAttribute('placeholder', '+1 (555) 123-4567');
        }

        // ===========================
        // Clear Form Errors from Server
        // ===========================
        const formErrors = document.querySelector('.form-errors');
        if (formErrors) {
            setTimeout(function() {
                formErrors.style.animation = 'shake 0.3s ease';
            }, 100);

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
        if (usernameInput && !usernameInput.value) {
            setTimeout(function() {
                usernameInput.focus();
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

                setTimeout(function() {
                    isSubmitting = false;
                }, 10000);
            });
        }

        // ===========================
        // Smooth Scroll to Top
        // ===========================
        window.scrollTo({ top: 0, behavior: 'instant' });

        // ===========================
        // Console Message
        // ===========================
        console.log('%cVolunteer Registration Ready', 'color: #4f46e5; font-size: 16px; font-weight: bold;');

    });

})();