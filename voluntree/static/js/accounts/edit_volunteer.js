// Edit Profile Volunteer JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Profile Picture Preview
        // ===========================
        const profilePictureInput = document.getElementById('id_profile_picture');
        const previewImage = document.getElementById('previewImage');
        const previewPlaceholder = document.getElementById('previewPlaceholder');

        if (profilePictureInput) {
            profilePictureInput.addEventListener('change', function(e) {
                const file = e.target.files[0];

                if (file) {
                    // Validate file size (5MB max)
                    if (file.size > 5 * 1024 * 1024) {
                        alert('File size must be less than 5MB');
                        this.value = '';
                        return;
                    }

                    // Validate file type
                    if (!file.type.match('image.*')) {
                        alert('Please select a valid image file');
                        this.value = '';
                        return;
                    }

                    // Preview the image
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        if (previewImage) {
                            previewImage.src = event.target.result;
                            previewImage.style.display = 'block';
                        } else if (previewPlaceholder) {
                            const img = document.createElement('img');
                            img.src = event.target.result;
                            img.alt = 'Profile Picture';
                            img.id = 'previewImage';
                            img.className = 'preview-image';
                            previewPlaceholder.replaceWith(img);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // ===========================
        // Form Validation
        // ===========================
        const editForm = document.getElementById('editProfileForm');

        if (editForm) {
            editForm.addEventListener('submit', function(e) {
                let isValid = true;
                const errors = [];

                // Email validation
                const email = document.getElementById('id_email');
                if (email && email.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(email.value.trim())) {
                        isValid = false;
                        errors.push('Please enter a valid email address');
                        email.classList.add('error');
                    } else {
                        email.classList.remove('error');
                    }
                } else if (email && email.required) {
                    isValid = false;
                    errors.push('Email is required');
                    email.classList.add('error');
                }

                // Phone validation (if provided)
                const phone = document.getElementById('id_phone');
                if (phone && phone.value.trim()) {
                    const phonePattern = /^[\d\s\-\+\(\)]+$/;
                    if (!phonePattern.test(phone.value.trim())) {
                        isValid = false;
                        errors.push('Please enter a valid phone number');
                        phone.classList.add('error');
                    } else {
                        phone.classList.remove('error');
                    }
                }

                // Date of birth validation
                const dob = document.getElementById('id_date_of_birth');
                if (dob && dob.value) {
                    const dobDate = new Date(dob.value);
                    const today = new Date();
                    const age = today.getFullYear() - dobDate.getFullYear();

                    if (age < 13 || age > 120) {
                        isValid = false;
                        errors.push('Please enter a valid date of birth');
                        dob.classList.add('error');
                    } else {
                        dob.classList.remove('error');
                    }
                }

                if (!isValid) {
                    e.preventDefault();
                    showErrors(errors);
                }
            });
        }

        function showErrors(errors) {
            // Remove existing error messages
            const existingError = document.querySelector('.validation-errors');
            if (existingError) {
                existingError.remove();
            }

            if (errors.length > 0) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'validation-errors';
                errorDiv.innerHTML = `
                    <h3>Please correct the following errors:</h3>
                    <ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>
                `;

                const form = document.getElementById('editProfileForm');
                form.insertBefore(errorDiv, form.firstChild);

                // Scroll to errors
                errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Auto-remove after 5 seconds
                setTimeout(() => {
                    errorDiv.style.opacity = '0';
                    setTimeout(() => errorDiv.remove(), 300);
                }, 5000);
            }
        }

        // ===========================
        // Auto-save Draft (Optional)
        // ===========================
        let autoSaveTimeout;
        const formInputs = editForm ? editForm.querySelectorAll('input, textarea') : [];

        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                clearTimeout(autoSaveTimeout);
                autoSaveTimeout = setTimeout(() => {
                    saveDraft();
                }, 2000); // Save after 2 seconds of inactivity
            });
        });

        function saveDraft() {
            const formData = {};
            formInputs.forEach(input => {
                if (input.type !== 'file' && input.name) {
                    formData[input.name] = input.value;
                }
            });

            // Store in memory (no localStorage)
            window.profileDraft = formData;

            // Show save indicator
            showSaveIndicator();
        }

        function showSaveIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'save-indicator';
            indicator.textContent = 'Draft saved';
            document.body.appendChild(indicator);

            setTimeout(() => {
                indicator.classList.add('show');
            }, 10);

            setTimeout(() => {
                indicator.classList.remove('show');
                setTimeout(() => indicator.remove(), 300);
            }, 2000);
        }

        // ===========================
        // Character Counter for Textarea
        // ===========================
        const bioTextarea = document.getElementById('id_bio');
        if (bioTextarea) {
            const maxLength = 500;
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            bioTextarea.parentNode.appendChild(counter);

            function updateCounter() {
                const remaining = maxLength - bioTextarea.value.length;
                counter.textContent = `${bioTextarea.value.length} / ${maxLength} characters`;
                counter.style.color = remaining < 50 ? '#ef4444' : '#6b7280';
            }

            bioTextarea.setAttribute('maxlength', maxLength);
            bioTextarea.addEventListener('input', updateCounter);
            updateCounter();
        }

        // ===========================
        // Smooth Scroll for Back Link
        // ===========================
        const backLink = document.querySelector('.back-link');
        if (backLink) {
            backLink.addEventListener('click', function(e) {
                // Add smooth transition
                document.body.style.opacity = '0.8';
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 300);
            });
        }

        // ===========================
        // Form Cards Animation on Load
        // ===========================
        const formCards = document.querySelectorAll('.form-card');
        formCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // ===========================
        // Confirm Before Leaving with Unsaved Changes
        // ===========================
        let formChanged = false;

        formInputs.forEach(input => {
            input.addEventListener('change', function() {
                formChanged = true;
            });
        });

        window.addEventListener('beforeunload', function(e) {
            if (formChanged && !editForm.submitted) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });

        if (editForm) {
            editForm.addEventListener('submit', function() {
                editForm.submitted = true;
            });
        }

        // ===========================
        // Input Focus Effects
        // ===========================
        const formInputFields = document.querySelectorAll('.form-input, .form-textarea');
        formInputFields.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                if (this.value.trim()) {
                    this.parentElement.classList.add('filled');
                } else {
                    this.parentElement.classList.remove('filled');
                }
            });

            // Initialize filled state
            if (input.value.trim()) {
                input.parentElement.classList.add('filled');
            }
        });

        // ===========================
        // Skills/Interests Tag Input Enhancement
        // ===========================
        const skillsInput = document.getElementById('id_skills');
        const interestsInput = document.getElementById('id_interests');

        function enhanceTagInput(input) {
            if (!input) return;

            input.addEventListener('blur', function() {
                // Clean up and format comma-separated values
                const values = this.value.split(',')
                    .map(val => val.trim())
                    .filter(val => val.length > 0);
                this.value = values.join(', ');
            });
        }

        enhanceTagInput(skillsInput);
        enhanceTagInput(interestsInput);

        // ===========================
        // Success Message Animation
        // ===========================
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            showSuccessMessage('Profile updated successfully!');
        }

        function showSuccessMessage(message) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${message}</span>
            `;
            document.body.appendChild(successDiv);

            setTimeout(() => successDiv.classList.add('show'), 10);

            setTimeout(() => {
                successDiv.classList.remove('show');
                setTimeout(() => successDiv.remove(), 300);
            }, 3000);
        }

    });

})();