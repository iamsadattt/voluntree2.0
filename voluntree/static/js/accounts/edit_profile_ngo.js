// Edit Profile NGO JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Logo Preview
        // ===========================
        const logoInput = document.getElementById('id_logo');
        const previewImage = document.getElementById('previewImage');
        const previewPlaceholder = document.getElementById('previewPlaceholder');

        if (logoInput) {
            logoInput.addEventListener('change', function(e) {
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
                            img.alt = 'Organization Logo';
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
        // Verification Document Upload
        // ===========================
        const docInput = document.getElementById('id_verification_document');

        if (docInput) {
            docInput.addEventListener('change', function(e) {
                const file = e.target.files[0];

                if (file) {
                    // Validate file size (10MB max)
                    if (file.size > 10 * 1024 * 1024) {
                        alert('Document size must be less than 10MB');
                        this.value = '';
                        return;
                    }

                    // Validate file type
                    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (!allowedTypes.includes(file.type)) {
                        alert('Please upload a PDF, DOC, or DOCX file');
                        this.value = '';
                        return;
                    }

                    // Show selected file name
                    showDocumentSelected(file.name);
                }
            });
        }

        function showDocumentSelected(fileName) {
            const docGroup = document.getElementById('id_verification_document').parentElement;
            let fileIndicator = docGroup.querySelector('.file-indicator');

            if (!fileIndicator) {
                fileIndicator = document.createElement('div');
                fileIndicator.className = 'file-indicator';
                docGroup.appendChild(fileIndicator);
            }

            fileIndicator.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Selected: ${fileName}</span>
            `;
            fileIndicator.style.display = 'flex';
        }

        // ===========================
        // Form Validation
        // ===========================
        const editForm = document.getElementById('editProfileForm');

        if (editForm) {
            editForm.addEventListener('submit', function(e) {
                let isValid = true;
                const errors = [];

                // Organization Name validation
                const orgName = document.getElementById('id_organization_name');
                if (orgName && (!orgName.value.trim() || orgName.value.trim().length < 3)) {
                    isValid = false;
                    errors.push('Organization name must be at least 3 characters');
                    orgName.classList.add('error');
                } else if (orgName) {
                    orgName.classList.remove('error');
                }

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
                }

                // Phone validation
                const phone = document.getElementById('id_phone');
                if (phone && phone.value.trim()) {
                    const phonePattern = /^[\d\s\-\+\(\)]+$/;
                    if (!phonePattern.test(phone.value.trim()) || phone.value.trim().length < 10) {
                        isValid = false;
                        errors.push('Please enter a valid phone number (at least 10 digits)');
                        phone.classList.add('error');
                    } else {
                        phone.classList.remove('error');
                    }
                }

                // Website validation
                const website = document.getElementById('id_website');
                if (website && website.value.trim()) {
                    try {
                        new URL(website.value.trim());
                        website.classList.remove('error');
                    } catch (err) {
                        isValid = false;
                        errors.push('Please enter a valid website URL (e.g., https://example.org)');
                        website.classList.add('error');
                    }
                }

                // Description validation
                const description = document.getElementById('id_description');
                if (description && description.value.trim().length < 50) {
                    isValid = false;
                    errors.push('Organization description must be at least 50 characters');
                    description.classList.add('error');
                } else if (description) {
                    description.classList.remove('error');
                }

                // Focus Areas validation
                const focusAreas = document.getElementById('id_focus_areas');
                if (focusAreas && focusAreas.value.trim().length < 3) {
                    isValid = false;
                    errors.push('Please specify at least one focus area');
                    focusAreas.classList.add('error');
                } else if (focusAreas) {
                    focusAreas.classList.remove('error');
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
                    <ul>${errors.map(error => <li>${error}</li>).join('')}</ul>
                `;

                const form = document.getElementById('editProfileForm');
                form.insertBefore(errorDiv, form.firstChild);

                // Scroll to errors
                errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Auto-remove after 7 seconds
                setTimeout(() => {
                    errorDiv.style.opacity = '0';
                    setTimeout(() => errorDiv.remove(), 300);
                }, 7000);
            }
        }

        // ===========================
        // Auto-save Draft
        // ===========================
        let autoSaveTimeout;
        const formInputs = editForm ? editForm.querySelectorAll('input:not([type="file"]), textarea') : [];

        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                clearTimeout(autoSaveTimeout);
                autoSaveTimeout = setTimeout(() => {
                    saveDraft();
                }, 2000);
            });
        });

        function saveDraft() {
            const formData = {};
            formInputs.forEach(input => {
                if (input.name) {
                    formData[input.name] = input.value;
                }
            });

            // Store in memory
            window.organizationDraft = formData;

            showSaveIndicator();
        }

        function showSaveIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'save-indicator';
            indicator.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Draft saved</span>
            `;
            document.body.appendChild(indicator);

            setTimeout(() => indicator.classList.add('show'), 10);

            setTimeout(() => {
                indicator.classList.remove('show');
                setTimeout(() => indicator.remove(), 300);
            }, 2000);
        }

        // ===========================
        // Character Counter for Description
        // ===========================
        const descriptionTextarea = document.getElementById('id_description');
        if (descriptionTextarea) {
            const maxLength = 1000;
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            descriptionTextarea.parentNode.appendChild(counter);

            function updateCounter() {
                const remaining = maxLength - descriptionTextarea.value.length;
                counter.textContent = $;{descriptionTextarea.value.length} / ${maxLength} characters;

                if (remaining < 100) {
                    counter.style.color = '#ef4444';
                } else if (remaining < 200) {
                    counter.style.color = '#f59e0b';
                } else {
                    counter.style.color = '#6b7280';
                }
            }

            descriptionTextarea.setAttribute('maxlength', maxLength);
            descriptionTextarea.addEventListener('input', updateCounter);
            updateCounter();
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
        // Status Notice Animation
        // ===========================
        const statusNotice = document.querySelector('.status-notice');
        if (statusNotice) {
            statusNotice.style.opacity = '0';
            statusNotice.style.transform = 'scale(0.95)';

            setTimeout(() => {
                statusNotice.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                statusNotice.style.opacity = '1';
                statusNotice.style.transform = 'scale(1)';
            }, 600);
        }

        // ===========================
        // Confirm Before Leaving with Unsaved Changes
        // ===========================
        let formChanged = false;

        formInputs.forEach(input => {
            input.addEventListener('change', function() {
                formChanged = true;
            });
        });

        // Also track file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    formChanged = true;
                }
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
        // Focus Areas Tag Enhancement
        // ===========================
        const focusAreasInput = document.getElementById('id_focus_areas');

        if (focusAreasInput) {
            focusAreasInput.addEventListener('blur', function() {
                const values = this.value.split(',')
                    .map(val => val.trim())
                    .filter(val => val.length > 0);
                this.value = values.join(', ');

                // Show preview tags
                showFocusAreasPreview(values);
            });

            // Initialize preview on load
            if (focusAreasInput.value.trim()) {
                const values = focusAreasInput.value.split(',')
                    .map(val => val.trim())
                    .filter(val => val.length > 0);
                showFocusAreasPreview(values);
            }
        }

        function showFocusAreasPreview(areas) {
            const parentGroup = focusAreasInput.parentElement;
            let previewContainer = parentGroup.querySelector('.focus-areas-preview');

            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.className = 'focus-areas-preview';
                parentGroup.appendChild(previewContainer);
            }

            if (areas.length > 0) {
                previewContainer.innerHTML = areas.map(area =>
                    <span class="preview-tag">${area}</span>
                ).join('');
                previewContainer.style.display = 'flex';
            } else {
                previewContainer.style.display = 'none';
            }
        }

        // ===========================
        // Registration Number Info Tooltip
        // ===========================
        const regNumberInput = document.getElementById('id_registration_number');
        if (regNumberInput) {
            regNumberInput.addEventListener('click', function() {
                showTooltip(this, 'Contact support to modify registration number');
            });
        }

        function showTooltip(element, message) {
            const tooltip = document.createElement('div');
            tooltip.className = 'inline-tooltip';
            tooltip.textContent = message;

            element.parentElement.appendChild(tooltip);

            setTimeout(() => tooltip.classList.add('show'), 10);

            setTimeout(() => {
                tooltip.classList.remove('show');
                setTimeout(() => tooltip.remove(), 300);
            }, 3000);
        }

        // ===========================
        // Form Action Buttons
        // ===========================
        const saveButton = document.querySelector('.btn-save');
        const cancelButton = document.querySelector('.btn-cancel');

        if (saveButton) {
            saveButton.addEventListener('click', function(e) {
                // Add loading state
                if (editForm && editForm.checkValidity()) {
                    this.classList.add('loading');
                    this.disabled = true;

                    // The form will submit naturally, loading state will show
                }
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', function(e) {
                // Check if form has changes
                if (formChanged) {
                    const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
                    if (!confirmLeave) {
                        e.preventDefault();
                    }
                }
            });
        }

        // ===========================
        // Button Ripple Effect
        // ===========================
        const buttons = document.querySelectorAll('.btn-save, .btn-cancel, .btn-upload');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.className = 'button-ripple';

                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple CSS if not exists
        if (!document.getElementById('button-ripple-style')) {
            const style = document.createElement('style');
            style.id = 'button-ripple-style';
            style.textContent = `
                .btn-save, .btn-cancel, .btn-upload {
                    position: relative;
                    overflow: hidden;
                }

                .button-ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
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
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Success Message Animation
        // ===========================
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            showSuccessMessage('Organization profile updated successfully!');
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
            }, 4000);
        }

        // ===========================
        // Keyboard Shortcuts
        // ===========================
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (saveButton && !saveButton.disabled) {
                    saveButton.click();
                }
            }

            // Escape to cancel/go back
            if (e.key === 'Escape' && cancelButton) {
                cancelButton.click();
            }
        });

    });

})();