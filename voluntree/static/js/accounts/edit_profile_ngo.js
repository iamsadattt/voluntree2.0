// Edit NGO Profile JavaScript - Matching Voluntree Design Language
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Cache DOM Elements
        // ===========================
        const form = document.getElementById('editProfileForm');
        const logoInput = document.getElementById('id_logo');
        const previewImage = document.getElementById('previewImage');
        const previewPlaceholder = document.getElementById('previewPlaceholder');
        const saveButton = document.querySelector('.btn-save');
        const formInputs = document.querySelectorAll('.form-input, .form-textarea');
        const formCards = document.querySelectorAll('.form-card');

        // ===========================
        // Logo Preview Functionality
        // ===========================
        if (logoInput) {
            logoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];

                if (file) {
                    // Validate file type
                    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
                    if (!validTypes.includes(file.type)) {
                        showNotification('Please upload a JPG, PNG, or SVG file', 'error');
                        this.value = '';
                        return;
                    }

                    // Validate file size (5MB)
                    const maxSize = 5 * 1024 * 1024;
                    if (file.size > maxSize) {
                        showNotification('File size must be less than 5MB', 'error');
                        this.value = '';
                        return;
                    }

                    // Preview the image
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        if (previewImage) {
                            previewImage.src = event.target.result;
                            previewImage.style.display = 'block';
                            if (previewPlaceholder) {
                                previewPlaceholder.style.display = 'none';
                            }
                        } else if (previewPlaceholder) {
                            const img = document.createElement('img');
                            img.src = event.target.result;
                            img.id = 'previewImage';
                            img.className = 'preview-image';
                            previewPlaceholder.parentNode.replaceChild(img, previewPlaceholder);
                        }

                        // Add animation
                        const currentPicture = document.querySelector('.current-picture');
                        if (currentPicture) {
                            currentPicture.style.animation = 'zoomIn 0.5s ease';
                        }
                    };
                    reader.readAsDataURL(file);

                    showNotification('Logo preview updated', 'success');
                }
            });
        }

        // ===========================
        // Form Validation
        // ===========================
        function validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            let isValid = true;
            let message = '';

            // Remove previous validation
            field.classList.remove('error', 'success');
            const existingMessage = field.parentNode.querySelector('.validation-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                message = 'This field is required';
            }

            // Email validation
            if (fieldName === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
            }

            // URL validation
            if (fieldName === 'website' && value) {
                try {
                    new URL(value);
                    if (!value.startsWith('http://') && !value.startsWith('https://')) {
                        isValid = false;
                        message = 'URL must start with http:// or https://';
                    }
                } catch {
                    isValid = false;
                    message = 'Please enter a valid URL';
                }
            }

            // Phone validation
            if (fieldName === 'phone' && value) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(value) || value.length < 10) {
                    isValid = false;
                    message = 'Please enter a valid phone number';
                }
            }

            // Apply validation styling
            if (!isValid) {
                field.classList.add('error');
                showFieldMessage(field, message, 'error');
            } else if (value) {
                field.classList.add('success');
            }

            return isValid;
        }

        function showFieldMessage(field, message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `validation-message ${type}`;
            messageDiv.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${type === 'error' 
                        ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
                        : '<path d="M20 6L9 17l-5-5"></path>'
                    }
                </svg>
                <span>${message}</span>
            `;
            field.parentNode.appendChild(messageDiv);
        }

        // Add real-time validation
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', debounce(function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            }, 500));
        });

        // ===========================
        // Form Submission
        // ===========================
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Validate all fields
                let isFormValid = true;
                formInputs.forEach(input => {
                    if (!validateField(input)) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    showNotification('Please fix the errors before submitting', 'error');
                    scrollToFirstError();
                    return;
                }

                // Show loading state
                if (saveButton) {
                    saveButton.classList.add('loading');
                    saveButton.disabled = true;
                }

                // Disable form
                formInputs.forEach(input => {
                    input.disabled = true;
                });

                // Submit the form
                this.submit();
            });
        }

        // ===========================
        // Character Counter for Textareas
        // ===========================
        const textareas = document.querySelectorAll('.form-textarea');
        textareas.forEach(textarea => {
            const maxLength = textarea.getAttribute('maxlength');
            if (maxLength) {
                const counter = document.createElement('div');
                counter.className = 'character-counter';
                counter.style.cssText = `
                    text-align: right;
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                `;
                textarea.parentNode.appendChild(counter);

                function updateCounter() {
                    const remaining = maxLength - textarea.value.length;
                    counter.textContent = `${remaining} characters remaining`;

                    if (remaining < 20) {
                        counter.style.color = '#ef4444';
                    } else if (remaining < 50) {
                        counter.style.color = '#f59e0b';
                    } else {
                        counter.style.color = '#6b7280';
                    }
                }

                textarea.addEventListener('input', updateCounter);
                updateCounter();
            }
        });

        // ===========================
        // Auto-save Draft (to localStorage)
        // ===========================
        function saveDraft() {
            const formData = {};
            formInputs.forEach(input => {
                formData[input.name] = input.value;
            });
            // Note: localStorage would be used here, but per instructions, we'll skip actual storage
            console.log('Draft saved (localStorage not used per restrictions)');
        }

        function loadDraft() {
            // Would load from localStorage here
            console.log('Draft load attempted (localStorage not used per restrictions)');
        }

        // Save draft every 30 seconds
        setInterval(saveDraft, 30000);

        // Load draft on page load
        loadDraft();

        // ===========================
        // Unsaved Changes Warning
        // ===========================
        let formModified = false;

        formInputs.forEach(input => {
            input.addEventListener('change', function() {
                formModified = true;
            });
        });

        window.addEventListener('beforeunload', function(e) {
            if (formModified && !form.submitted) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });

        // Mark form as submitted when saving
        if (form) {
            form.addEventListener('submit', function() {
                this.submitted = true;
            });
        }

        // ===========================
        // Card Entrance Animations
        // ===========================
        function animateCardsOnScroll() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
            }, { threshold: 0.1 });

            formCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });
        }

        // ===========================
        // Focus Areas Tag Input Enhancement
        // ===========================
        const focusAreasInput = document.getElementById('id_focus_areas');
        if (focusAreasInput) {
            // Create visual tags display
            const tagsDisplay = document.createElement('div');
            tagsDisplay.className = 'tags-display';
            tagsDisplay.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 0.75rem;
                padding: 0.75rem;
                background: #f9fafb;
                border-radius: 8px;
                min-height: 50px;
            `;
            focusAreasInput.parentNode.appendChild(tagsDisplay);

            function updateTagsDisplay() {
                const value = focusAreasInput.value.trim();
                const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);

                tagsDisplay.innerHTML = '';
                if (tags.length === 0) {
                    tagsDisplay.innerHTML = '<span style="color: #9ca3af; font-size: 0.875rem;">Tags will appear here...</span>';
                } else {
                    tags.forEach(tag => {
                        const tagElement = document.createElement('span');
                        tagElement.className = 'preview-tag';
                        tagElement.textContent = tag;
                        tagElement.style.cssText = `
                            display: inline-block;
                            padding: 0.5rem 1rem;
                            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                            color: #667eea;
                            border: 1px solid rgba(102, 126, 234, 0.3);
                            border-radius: 20px;
                            font-size: 0.9rem;
                            font-weight: 500;
                            transition: all 0.3s ease;
                        `;

                        tagElement.addEventListener('mouseenter', function() {
                            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                            this.style.color = 'white';
                            this.style.transform = 'translateY(-2px)';
                            this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                        });

                        tagElement.addEventListener('mouseleave', function() {
                            this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                            this.style.color = '#667eea';
                            this.style.transform = '';
                            this.style.boxShadow = '';
                        });

                        tagsDisplay.appendChild(tagElement);
                    });
                }
            }

            focusAreasInput.addEventListener('input', debounce(updateTagsDisplay, 300));
            updateTagsDisplay();
        }

        // ===========================
        // File Input Enhancement
        // ===========================
        const verificationDocInput = document.getElementById('id_verification_document');
        if (verificationDocInput) {
            verificationDocInput.addEventListener('change', function(e) {
                const file = e.target.files[0];

                if (file) {
                    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (!validTypes.includes(file.type)) {
                        showNotification('Please upload a PDF, DOC, or DOCX file', 'error');
                        this.value = '';
                        return;
                    }

                    const maxSize = 10 * 1024 * 1024; // 10MB
                    if (file.size > maxSize) {
                        showNotification('File size must be less than 10MB', 'error');
                        this.value = '';
                        return;
                    }

                    showNotification(`File "${file.name}" selected`, 'success');
                }
            });
        }

        // ===========================
        // Utility Functions
        // ===========================
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;

            const icons = {
                success: '<path d="M20 6L9 17l-5-5"></path>',
                error: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
                info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
            };

            const colors = {
                success: '#10b981',
                error: '#ef4444',
                info: '#667eea'
            };

            notification.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${icons[type]}
                </svg>
                <span>${message}</span>
            `;

            notification.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                background: white;
                color: ${colors[type]};
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                border-left: 4px solid ${colors[type]};
                z-index: 10000;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
                max-width: 400px;
                font-weight: 500;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }

        function scrollToFirstError() {
            const firstError = document.querySelector('.form-input.error, .form-textarea.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }

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

            // Escape to cancel
            if (e.key === 'Escape') {
                const cancelBtn = document.querySelector('.btn-cancel');
                if (cancelBtn) {
                    if (formModified) {
                        if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
                            window.location.href = cancelBtn.href;
                        }
                    } else {
                        window.location.href = cancelBtn.href;
                    }
                }
            }
        });

        // ===========================
        // Form Field Enhancements
        // ===========================
        formInputs.forEach(input => {
            // Add floating label effect
            if (input.value) {
                input.classList.add('has-value');
            }

            input.addEventListener('input', function() {
                if (this.value) {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });

            // Add focus effects
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });

        // ===========================
        // Smooth Scroll to Sections
        // ===========================
        function createProgressIndicator() {
            const sections = document.querySelectorAll('.form-card');
            if (sections.length <= 1) return;

            const indicator = document.createElement('div');
            indicator.className = 'form-progress';
            indicator.style.cssText = `
                position: fixed;
                right: 2rem;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                z-index: 100;
            `;

            sections.forEach((section, index) => {
                const dot = document.createElement('button');
                dot.className = 'progress-dot';
                dot.style.cssText = `
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #d1d5db;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 0;
                `;

                dot.addEventListener('click', () => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });

                dot.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.5)';
                    this.style.background = '#667eea';
                });

                dot.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('active')) {
                        this.style.transform = 'scale(1)';
                        this.style.background = '#d1d5db';
                    }
                });

                indicator.appendChild(dot);
            });

            document.body.appendChild(indicator);

            // Update active dot on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = Array.from(sections).indexOf(entry.target);
                        const dots = indicator.querySelectorAll('.progress-dot');
                        dots.forEach((dot, i) => {
                            if (i === index) {
                                dot.classList.add('active');
                                dot.style.background = '#667eea';
                                dot.style.transform = 'scale(1.5)';
                            } else {
                                dot.classList.remove('active');
                                dot.style.background = '#d1d5db';
                                dot.style.transform = 'scale(1)';
                            }
                        });
                    }
                });
            }, { threshold: 0.5 });

            sections.forEach(section => observer.observe(section));
        }

        // ===========================
        // Initialize All Features
        // ===========================
        animateCardsOnScroll();
        createProgressIndicator();

        // ===========================
        // Console Message
        // ===========================
        console.log('%c✏️ Edit NGO Profile Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log('%cKeyboard Shortcuts:', 'color: #6b7280; font-size: 12px;');
        console.log('%c  Ctrl/Cmd + S: Save', 'color: #6b7280; font-size: 11px;');
        console.log('%c  Escape: Cancel', 'color: #6b7280; font-size: 11px;');

    });

})();

// ===========================
// Additional CSS Animations
// ===========================
const style = document.createElement('style');
style.textContent = `
    @keyframes zoomIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .form-group.focused label {
        color: #667eea;
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }

    .notification {
        pointer-events: auto;
    }

    .notification:hover {
        transform: translateX(-5px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
        .form-progress {
            display: none;
        }

        .notification {
            right: 1rem;
            left: 1rem;
            max-width: none;
        }
    }

    /* Smooth focus ring */
    .form-input:focus,
    .form-textarea:focus {
        animation: focusPulse 0.3s ease;
    }

    @keyframes focusPulse {
        0% {
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
        }
        100% {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
    }

    /* Loading animation for save button */
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Character counter animation */
    .character-counter {
        animation: fadeIn 0.3s ease;
    }

    /* Preview tag animations */
    .preview-tag {
        animation: tagPop 0.3s ease;
    }

    @keyframes tagPop {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    /* Form card hover shadow enhancement */
    .form-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Progress indicator on mobile */
    @media (max-width: 1024px) {
        .form-progress {
            right: 1rem;
        }
    }

    /* Accessibility improvements */
    .form-input:focus-visible,
    .form-textarea:focus-visible,
    button:focus-visible {
        outline: 2px solid #667eea;
        outline-offset: 2px;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);