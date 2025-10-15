// Assign Certificate Page JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // DOM Elements
        // ===========================
        const selectAllCheckbox = document.getElementById('selectAll');
        const volunteerCheckboxes = document.querySelectorAll('.volunteer-checkbox:not(:disabled)');
        const selectedCountSpan = document.getElementById('selectedCount');
        const assignBtn = document.getElementById('assignBtn');
        const assignForm = document.getElementById('assignForm');

        // ===========================
        // Update Selected Count
        // ===========================
        function updateSelectedCount() {
            const checkedCount = document.querySelectorAll('.volunteer-checkbox:checked:not(:disabled)').length;
            selectedCountSpan.textContent = checkedCount;

            // Enable/disable assign button
            if (assignBtn) {
                assignBtn.disabled = checkedCount === 0;
            }

            // Update select all checkbox state
            if (selectAllCheckbox) {
                const allChecked = volunteerCheckboxes.length > 0 &&
                    Array.from(volunteerCheckboxes).every(cb => cb.checked);
                const someChecked = Array.from(volunteerCheckboxes).some(cb => cb.checked);

                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = someChecked && !allChecked;
            }

            // Add pulse animation to count
            selectedCountSpan.style.transform = 'scale(1.2)';
            setTimeout(() => {
                selectedCountSpan.style.transform = 'scale(1)';
            }, 200);
        }

        // Add transition to count
        if (selectedCountSpan) {
            selectedCountSpan.style.transition = 'transform 0.2s ease';
        }

        // ===========================
        // Select All Functionality
        // ===========================
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                const isChecked = this.checked;

                volunteerCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                    animateCheckbox(checkbox);
                });

                updateSelectedCount();
            });
        }

        // ===========================
        // Individual Checkbox Listeners
        // ===========================
        volunteerCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectedCount();
                animateCheckbox(this);
            });
        });

        // ===========================
        // Animate Checkbox Check
        // ===========================
        function animateCheckbox(checkbox) {
            const volunteerItem = checkbox.closest('.volunteer-item');
            if (!volunteerItem) return;

            if (checkbox.checked) {
                volunteerItem.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                volunteerItem.style.borderColor = '#667eea';
                volunteerItem.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    volunteerItem.style.transform = 'scale(1)';
                }, 150);
            } else {
                volunteerItem.style.background = '#f9fafb';
                volunteerItem.style.borderColor = '#e5e7eb';
            }
        }

        // ===========================
        // Form Submission Validation
        // ===========================
        if (assignForm) {
            assignForm.addEventListener('submit', function(e) {
                const checkedCount = document.querySelectorAll('.volunteer-checkbox:checked:not(:disabled)').length;

                if (checkedCount === 0) {
                    e.preventDefault();
                    showNotification('Please select at least one volunteer', 'warning');
                    return false;
                }

                // Show confirmation
                const confirmed = confirm(`Are you sure you want to assign certificates to ${checkedCount} volunteer(s)?`);
                if (!confirmed) {
                    e.preventDefault();
                    return false;
                }

                // Show loading state
                if (assignBtn) {
                    assignBtn.disabled = true;
                    assignBtn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 0.5rem;"><span class="spinner"></span>Assigning...</span>';
                }
            });
        }

        // ===========================
        // Volunteer Item Click (Select on Row Click)
        // ===========================
        const volunteerItems = document.querySelectorAll('.volunteer-item');
        volunteerItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Ignore if clicking on the checkbox itself or if item is assigned
                if (e.target.type === 'checkbox' || this.classList.contains('assigned')) {
                    return;
                }

                const checkbox = this.querySelector('.volunteer-checkbox:not(:disabled)');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });

            // Add cursor pointer for clickable items
            if (!item.classList.contains('assigned')) {
                item.style.cursor = 'pointer';
            }
        });

        // ===========================
        // Keyboard Navigation
        // ===========================
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + A to select all
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                const activeElement = document.activeElement;
                if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    if (selectAllCheckbox) {
                        selectAllCheckbox.checked = !selectAllCheckbox.checked;
                        selectAllCheckbox.dispatchEvent(new Event('change'));
                    }
                }
            }
        });

        // ===========================
        // Notification System
        // ===========================
        function showNotification(message, type = 'info') {
            // Remove existing notification
            const existing = document.querySelector('.notification');
            if (existing) {
                existing.remove();
            }

            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;

            const colors = {
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#667eea'
            };

            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 2rem;
                background: ${colors[type] || colors.info};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                font-weight: 600;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Add notification animations
        if (!document.getElementById('notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        // ===========================
        // Search/Filter Functionality
        // ===========================
        function addSearchFunctionality() {
            const sectionHeader = document.querySelector('.section-header');
            if (!sectionHeader) return;

            const searchContainer = document.createElement('div');
            searchContainer.style.cssText = `
                flex: 1;
                max-width: 400px;
                margin: 0 2rem;
            `;

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = '🔍 Search volunteers...';
            searchInput.style.cssText = `
                width: 100%;
                padding: 0.75rem 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.3s ease;
            `;

            searchInput.addEventListener('focus', function() {
                this.style.borderColor = '#667eea';
                this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            });

            searchInput.addEventListener('blur', function() {
                this.style.borderColor = '#e5e7eb';
                this.style.boxShadow = 'none';
            });

            searchInput.addEventListener('input', debounce(function() {
                const searchTerm = this.value.toLowerCase().trim();
                filterVolunteers(searchTerm);
            }, 300));

            searchContainer.appendChild(searchInput);
            sectionHeader.insertBefore(searchContainer, sectionHeader.querySelector('.select-all-container'));
        }

        function filterVolunteers(searchTerm) {
            const items = document.querySelectorAll('.volunteer-item');
            let visibleCount = 0;

            items.forEach(item => {
                const name = item.querySelector('.volunteer-name')?.textContent.toLowerCase() || '';
                const email = item.querySelector('.volunteer-details')?.textContent.toLowerCase() || '';
                const isMatch = name.includes(searchTerm) || email.includes(searchTerm);

                if (isMatch) {
                    item.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });

            // Update count in header
            const headerH2 = document.querySelector('.section-header h2');
            if (headerH2) {
                const originalText = headerH2.textContent.split('(')[0].trim();
                headerH2.textContent = `${originalText} (${visibleCount})`;
            }
        }

        // Add search if there are volunteers
        if (volunteerCheckboxes.length > 0) {
            addSearchFunctionality();
        }

        // ===========================
        // Debounce Utility
        // ===========================
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // ===========================
        // Smooth Scroll to Top Button
        // ===========================
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            z-index: 99;
        `;

        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
            this.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.5)';
        });

        scrollButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        });

        document.body.appendChild(scrollButton);

        window.addEventListener('scroll', debounce(function() {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
            }
        }, 100));

        // ===========================
        // Initialize Count on Load
        // ===========================
        updateSelectedCount();

        // ===========================
        // Analytics Tracking (Placeholder)
        // ===========================
        if (assignBtn) {
            assignBtn.addEventListener('click', function() {
                const count = document.querySelectorAll('.volunteer-checkbox:checked:not(:disabled)').length;
                if (typeof console !== 'undefined') {
                    console.log('Certificates assigned to', count, 'volunteers');
                }
            });
        }

        // ===========================
        // Success Message from Backend
        // ===========================
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            showNotification('Certificates assigned successfully!', 'success');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }

    });

})();