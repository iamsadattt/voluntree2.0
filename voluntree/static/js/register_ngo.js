// Organization Registration Page JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Cache DOM elements
        // ===========================
        const form = document.querySelector('.auth-form');
        const inputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
        const submitBtn = document.querySelector('.btn-submit');
        const authCard = document.querySelector('.auth-card');

        const usernameInput = document.querySelector('input[name="username"]');
        const emailInput = document.querySelector('input[name="email"]');
        const password1Input = document.querySelector('input[name="password1"]');
        const password2Input = document.querySelector('input[name="password2"]');

        const orgNameInput = document.querySelector('input[name="organization_name"]');
        const regNumberInput = document.querySelector('input[name="registration_number"]');
        const websiteInput = document.querySelector('input[name="website"]');
        const descriptionInput = document.querySelector('textarea[name="description"]');
        const focusAreasInput = document.querySelector('input[name="focus_areas"]');
        const phoneInput = document.querySelector('input[name="phone"]');
        const addressInput = document.querySelector('input[name="address"]');
        const cityInput = document.querySelector('input[name="city"]');
        const countryInput = document.querySelector('select[name="country"]');


        // ===========================
        // Add entrance animation (Hover effect)
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
        // Real-time Input Validation Setup
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
            const isSelect = input.tagName === 'SELECT';

            // Function to handle required fields
            const isRequired = () => {
                const requiredFields = [
                    'username', 'email', 'password1', 'password2',
                    'organization_name', 'registration_number',
                    'description', 'focus_areas', 'phone',
                    'address', 'city', 'country'
                ];
                return requiredFields.includes(fieldName);
            };

            // Check if required field is empty
            if (isRequired() && value === '') {
                showInputError(input, isSelect ? 'Please select a value' : `${fieldName.replace(/_/g, ' ')} is required`);
                return false;
            }

            // --- Account Information Validation ---

            if (fieldName === 'username') {
                if (value.length < 3) {
                    showInputError(input, 'Username must be at least 3 characters');
                    return false;
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    showInputError(input, 'Username can only contain letters, numbers, and underscores');
                    return false;
                }
            }

            if (fieldName === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showInputError(input, 'Please enter a valid email address');
                    return false;
                }
            }

            if (fieldName === 'password1') {
                if (value.length < 8) {
                    showInputError(input, 'Password must be at least 8 characters');
                    return false;
                }
            }

            if (fieldName === 'password2') {
                const password1 = password1Input ? password1Input.value : '';
                if (value !== password1) {
                    showInputError(input, 'Passwords do not match');
                    return false;
                }
            }

            // --- Organization Details Validation ---

            if (fieldName === 'organization_name') {
                if (value.length < 5) {
                    showInputError(input, 'Organization name must be at least 5 characters');
                    return false;
                }
            }

            if (fieldName === 'registration_number') {
                // Basic check for alphanumeric, allowing hyphens/spaces
                if (!/^[a-zA-Z0-9\s\-]{5,}$/.test(value)) {
                    showInputError(input, 'Please enter a valid registration number');
                    return false;
                }
            }

            if (fieldName === 'website' && value !== '') {
                // Basic URL validation
                const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                if (!urlRegex.test(value)) {
                    showInputError(input, 'Please enter a valid website URL');
                    return false;
                }
            }

            if (fieldName === 'description') {
                 if (value.length < 20) {
                    showInputError(input, 'Description must be at least 20 characters');
                    return false;
                }
            }

            // --- Contact Information Validation ---

            if (fieldName === 'phone') {
                const phoneRegex = /^[\d\s\+\-\(\)]+$/;
                if (!phoneRegex.test(value)) {
                    showInputError(input, 'Please enter a valid phone number');
                    return false;
                }
            }

            // If all checks pass for the field
            clearInputError(input);
            input.classList.add('success');
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
            // Ensure select and textarea also get success class if valid
            if (input.value.trim() !== '' && input.tagName !== 'SELECT') {
                input.classList.add('success');
            } else if (input.tagName === 'SELECT' && input.value !== '') {
                 input.classList.add('success');
            }
        }

        // ===========================
        // Password Strength Indicator (Copied from Volunteer Registration)
        // ===========================
        if (password1Input) {
            const strengthContainer = document.createElement('div');
            strengthContainer.className = 'password-strength';

            const strengthBar = document.createElement('div');
            strengthBar.className = 'password-strength-bar';

            const strengthText = document.createElement('div');
            strengthText.className = 'password-strength-text';

            strengthContainer.appendChild(strengthBar);

            const passwordGroup = password1Input.closest('.form-group');
            if (passwordGroup) {
                // Insert indicator after the input
                passwordGroup.appendChild(strengthContainer);
                passwordGroup.appendChild(strengthText);
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
        // Password Visibility Toggles (Copied from Volunteer Registration)
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
        // Phone Input Placeholder
        // ===========================
        if (phoneInput) {
            phoneInput.setAttribute('placeholder', '+1 (555) 123-4567');
        }


        // ===========================
        // Form Submit Validation
        // ===========================
        if (form) {
            form.addEventListener('submit', function(e) {
                let isValid = true;

                // Validate all inputs (required and non-empty optional ones)
                inputs.forEach(input => {
                    const isRequiredField = ['username', 'email', 'password1', 'password2', 'organization_name', 'registration_number', 'description', 'focus_areas', 'phone', 'address', 'city', 'country'].includes(input.name);

                    if (isRequiredField || input.value.trim() !== '') {
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

                    // Show notification (if a global notification function exists)
                    if (window.showNotification) {
                        window.showNotification('Please fix the errors in the form', 'error');
                    }

                    return false;
                }

                // Add loading state
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Registering...';
                submitBtn.disabled = true;
            });
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
        // Console Message
        // ===========================
        console.log('%cOrganization Registration Ready', 'color: #4f46e5; font-size: 16px; font-weight: bold;');

    });

})();