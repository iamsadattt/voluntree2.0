// Event Form JavaScript - Matching Voluntree Design Language
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Cache DOM Elements
        // ===========================
        const form = document.querySelector('.form-card form');
        const submitButton = document.querySelector('.btn-submit');
        const imageInput = document.querySelector('input[type="file"][name="image"]');
        const certificateInput = document.querySelector('input[type="file"][name="certificate_file"]');
        const dateInput = document.querySelector('input[name="date"]');
        const maxVolunteersInput = document.querySelector('input[name="max_volunteers"]');
        const requiredSkillsInput = document.querySelector('input[name="required_skills"], textarea[name="required_skills"]');
        const allInputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');

        // ===========================
        // Image Preview Functionality
        // ===========================
        if (imageInput) {
            imageInput.addEventListener('change', function(e) {
                const file = e.target.files[0];

                if (file) {
                    // Validate file type
                    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                    if (!validTypes.includes(file.type)) {
                        showNotification('Please upload a valid image file (JPG, PNG, WebP)', 'error');
                        this.value = '';
                        return;
                    }

                    // Validate file size (5MB)
                    const maxSize = 5 * 1024 * 1024;
                    if (file.size > maxSize) {
                        showNotification('Image size must be less than 5MB', 'error');
                        this.value = '';
                        return;
                    }

                    // Create preview
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        let currentImageDiv = document.querySelector('.current-image');

                        if (!currentImageDiv) {
                            currentImageDiv = document.createElement('div');
                            currentImageDiv.className = 'current-image';
                            imageInput.parentNode.appendChild(currentImageDiv);
                        }

                        currentImageDiv.innerHTML = `
                            <p>Preview:</p>
                            <img src="${event.target.result}" alt="Event image preview" style="animation: zoomIn 0.5s ease;">
                        `;
                    };
                    reader.readAsDataURL(file);

                    showNotification('Image preview loaded', 'success');
                }
            });
        }

        // ===========================
        // Certificate File Validation
        // ===========================
        if (certificateInput) {
            certificateInput.addEventListener('change', function(e) {
                const file = e.target.files[0];

                if (file) {
                    const validTypes = [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'image/jpeg',
                        'image/png'
                    ];

                    if (!validTypes.includes(file.type)) {
                        showNotification('Please upload a valid certificate file (PDF, DOC, DOCX, or Image)', 'error');
                        this.value = '';
                        return;
                    }

                    const maxSize = 10 * 1024 * 1024; // 10MB
                    if (file.size > maxSize) {
                        showNotification('Certificate file size must be less than 10MB', 'error');
                        this.value = '';
                        return;
                    }

                    // Show success message with file info
                    const fileSize = (file.size / 1024).toFixed(2);
                    const fileType = file.type.includes('pdf') ? 'PDF' :
                                    file.type.includes('word') ? 'Word Document' : 'Image';

                    showNotification(`Certificate uploaded: ${file.name} (${fileSize}KB, ${fileType})`, 'success');
                }
            });
        }

        // ===========================
        // Date/Time Validation
        // ===========================
        if (dateInput) {
            dateInput.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const now = new Date();

                if (selectedDate < now) {
                    showNotification('Event date must be in the future', 'error');
                    this.classList.add('error');
                    return;
                }

                this.classList.remove('error');
                this.classList.add('success');
            });

            // Set minimum date to today
            const today = new Date();
            const minDate = today.toISOString().slice(0, 16);
            dateInput.setAttribute('min', minDate);
        }

        // ===========================
        // Max Volunteers Validation
        // ===========================
        if (maxVolunteersInput) {
            maxVolunteersInput.addEventListener('input', function() {
                const value = parseInt(this.value);

                if (value < 1) {
                    this.value = 1;
                    showNotification('Minimum 1 volunteer required', 'error');
                }

                if (value > 1000) {
                    this.value = 1000;
                    showNotification('Maximum 1000 volunteers allowed', 'error');
                }
            });
        }

        // ===========================
        // Required Skills Tag Display
        // ===========================
        if (requiredSkillsInput) {
            const tagsDisplay = document.createElement('div');
            tagsDisplay.className = 'skills-tags-display';
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

            requiredSkillsInput.parentNode.insertBefore(tagsDisplay, requiredSkillsInput.nextSibling.nextSibling || null);

            function updateSkillsTags() {
                const value = requiredSkillsInput.value.trim();
                const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);

                tagsDisplay.innerHTML = '';

                if (skills.length === 0) {
                    tagsDisplay.innerHTML = '<span style="color: #9ca3af; font-size: 0.875rem;">Skills will appear here (comma-separated)...</span>';
                } else {
                    skills.forEach(skill => {
                        const tag = document.createElement('span');
                        tag.textContent = skill;
                        tag.style.cssText = `
                            display: inline-block;
                            padding: 0.5rem 1rem;
                            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                            color: #667eea;
                            border: 1px solid rgba(102, 126, 234, 0.3);
                            border-radius: 20px;
                            font-size: 0.9rem;
                            font-weight: 500;
                            transition: all 0.3s ease;
                            cursor: default;
                        `;

                        tag.addEventListener('mouseenter', function() {
                            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                            this.style.color = 'white';
                            this.style.transform = 'translateY(-2px)';
                            this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                        });

                        tag.addEventListener('mouseleave', function() {
                            this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                            this.style.color = '#667eea';
                            this.style.transform = '';
                            this.style.boxShadow = '';
                        });

                        tagsDisplay.appendChild(tag);
                    });
                }
            }

            requiredSkillsInput.addEventListener('input', debounce(updateSkillsTags, 300));
            updateSkillsTags();
        }

        // ===========================
        // Character Counter for Description
        // ===========================
        const descriptionTextarea = document.querySelector('textarea[name="description"]');
        if (descriptionTextarea) {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.cssText = `
                text-align: right;
                color: #6b7280;
                font-size: 0.875rem;
                margin-top: 0.5rem;
            `;

            const maxLength = descriptionTextarea.maxLength || 1000;

            function updateCounter() {
                const remaining = maxLength - descriptionTextarea.value.length;
                counter.textContent = `${remaining} characters remaining`;

                if (remaining < 50) {
                    counter.style.color = '#ef4444';
                } else if (remaining < 100) {
                    counter.style.color = '#f59e0b';
                } else {
                    counter.style.color = '#6b7280';
                }
            }

            descriptionTextarea.parentNode.appendChild(counter);
            descriptionTextarea.addEventListener('input', updateCounter);
            updateCounter();
        }

        // ===========================
        // Form Validation
        // ===========================
        function validateForm() {
            let isValid = true;
            const errors = [];

            // Check required fields
            const requiredFields = document.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    const label = document.querySelector(`label[for="${field.id}"]`);
                    if (label) {
                        errors.push(`${label.textContent.replace('*', '').trim()} is required`);
                    }
                } else {
                    field.classList.remove('error');
                    field.classList.add('success');
                }
            });

            if (!isValid) {
                showNotification('Please fill in all required fields', 'error');
                scrollToFirstError();
            }

            return isValid;
        }

        // ===========================
        // Form Submission - FIXED VERSION
        // ===========================
        if (form) {
            form.addEventListener('submit', function(e) {
                // Validate form
                if (!validateForm()) {
                    e.preventDefault();
                    return false;
                }

                // Validation passed - show loading state but let form submit
                if (submitButton) {
                    submitButton.classList.add('loading');
                    submitButton.disabled = true;
                    const originalText = submitButton.textContent;
                    submitButton.textContent = 'Submitting...';
                }

                showNotification('Submitting event...', 'info');

                // Mark form as submitted to avoid unsaved changes warning
                formModified = false;

                // DON'T disable inputs - they need to be active for form submission
                // DON'T prevent default - let the form submit naturally
                // Form will submit after this event handler completes
            });
        }

        // ===========================
        // Unsaved Changes Warning
        // ===========================
        let formModified = false;

        allInputs.forEach(input => {
            input.addEventListener('change', function() {
                formModified = true;
            });
        });

        window.addEventListener('beforeunload', function(e) {
            if (formModified && form && !form.submitted) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });

        // ===========================
        // Auto-grow Textarea
        // ===========================
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            function autoGrow() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            }

            textarea.addEventListener('input', autoGrow);
            autoGrow.call(textarea);
        });

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
            const firstError = document.querySelector('.error');
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
                if (submitButton && !submitButton.disabled) {
                    form.submit();
                }
            }

            // Escape to cancel
            if (e.key === 'Escape') {
                const cancelBtn = document.querySelector('.btn-cancel');
                if (cancelBtn && !e.target.matches('input, textarea, select')) {
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
        // Input Focus Enhancement
        // ===========================
        allInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });

        // ===========================
        // Certificate Section Enhancement
        // ===========================
        const certificateSection = document.querySelector('.certificate-section');
        if (certificateSection) {
            certificateSection.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
            });

            certificateSection.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        }

        // ===========================
        // Status Badge Animation
        // ===========================
        const statusBadges = document.querySelectorAll('.certificate-status-badge');
        statusBadges.forEach(badge => {
            if (badge.classList.contains('status-pending')) {
                setInterval(() => {
                    badge.style.animation = 'pulse 1.5s ease';
                    setTimeout(() => {
                        badge.style.animation = '';
                    }, 1500);
                }, 3000);
            }
        });

        // ===========================
        // Form Card Animation on Load
        // ===========================
        const formCard = document.querySelector('.form-card');
        if (formCard) {
            setTimeout(() => {
                formCard.style.transform = 'translateY(0)';
                formCard.style.opacity = '1';
            }, 100);
        }

        // ===========================
        // Smooth Label Float Effect
        // ===========================
        allInputs.forEach(input => {
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
        });

        // ===========================
        // Real-time Field Validation
        // ===========================
        const titleInput = document.querySelector('input[name="title"]');
        if (titleInput) {
            titleInput.addEventListener('blur', function() {
                if (this.value.trim().length < 5) {
                    this.classList.add('error');
                    showNotification('Event title should be at least 5 characters', 'error');
                } else {
                    this.classList.remove('error');
                    this.classList.add('success');
                }
            });
        }

        const locationInput = document.querySelector('input[name="location"]');
        if (locationInput) {
            locationInput.addEventListener('blur', function() {
                if (this.value.trim().length < 3) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                    this.classList.add('success');
                }
            });
        }

        // ===========================
        // File Input Enhancement
        // ===========================
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.className = 'file-input-wrapper';
            wrapper.style.cssText = `
                position: relative;
                margin-top: 0.5rem;
            `;

            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.style.cssText = `
                margin-top: 0.5rem;
                padding: 0.75rem;
                background: rgba(102, 126, 234, 0.05);
                border-radius: 6px;
                font-size: 0.875rem;
                color: #667eea;
                display: none;
            `;
            wrapper.appendChild(fileInfo);

            input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    fileInfo.innerHTML = `
                        <strong>Selected:</strong> ${file.name} 
                        <span style="color: #6b7280;">(${(file.size / 1024).toFixed(2)} KB)</span>
                    `;
                    fileInfo.style.display = 'block';
                    fileInfo.style.animation = 'slideIn 0.3s ease';
                } else {
                    fileInfo.style.display = 'none';
                }
            });
        });

        // ===========================
        // Form Progress Indicator
        // ===========================
        function createProgressBar() {
            const progressBar = document.createElement('div');
            progressBar.className = 'form-progress-bar';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                z-index: 10000;
                transition: width 0.3s ease;
            `;
            document.body.appendChild(progressBar);

            function updateProgress() {
                let filledFields = 0;
                allInputs.forEach(input => {
                    if (input.value && input.value.trim() !== '') {
                        filledFields++;
                    }
                });

                const progress = (filledFields / allInputs.length) * 100;
                progressBar.style.width = progress + '%';

                if (progress === 100) {
                    progressBar.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                } else {
                    progressBar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
            }

            allInputs.forEach(input => {
                input.addEventListener('input', debounce(updateProgress, 200));
                input.addEventListener('change', updateProgress);
            });

            updateProgress();
        }

        createProgressBar();

        // ===========================
        // Initialize All Features
        // ===========================
        console.log('%c📝 Event Form Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log('%cKeyboard Shortcuts:', 'color: #6b7280; font-size: 12px;');
        console.log('%c  Ctrl/Cmd + S: Submit Form', 'color: #6b7280; font-size: 11px;');
        console.log('%c  Escape: Cancel (with confirmation)', 'color: #6b7280; font-size: 11px;');

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

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0%, 100% { 
            transform: scale(1); 
            opacity: 1;
        }
        50% { 
            transform: scale(1.05); 
            opacity: 0.8;
        }
    }

    .form-group.focused label {
        color: #667eea;
        transition: all 0.3s ease;
    }

    .notification {
        pointer-events: auto;
    }

    .notification:hover {
        transform: translateX(-5px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }

    .certificate-section {
        transition: all 0.3s ease;
    }

    .file-info {
        animation: slideIn 0.3s ease;
    }

    .skills-tags-display span {
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

    @media (max-width: 768px) {
        .notification {
            right: 1rem;
            left: 1rem;
            max-width: none;
        }
    }

    .form-group input:focus-visible,
    .form-group textarea:focus-visible,
    .form-group select:focus-visible {
        outline: 2px solid #667eea;
        outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }

    .form-progress-bar {
        box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }
`;
document.head.appendChild(style);