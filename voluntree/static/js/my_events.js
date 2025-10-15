// ===============================
// My Events Page Script
// File: static/js/events/my_events.js
// ===============================

document.addEventListener('DOMContentLoaded', () => {
    // Smooth hover animation for cards
    const cards = document.querySelectorAll('.event-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    // Add subtle animation on Withdraw buttons
    const withdrawButtons = document.querySelectorAll('.btn-withdraw');
    withdrawButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const confirmed = confirm("Are you sure you want to withdraw?");
            if (!confirmed) {
                e.preventDefault();
            } else {
                button.classList.add('button-disabled');
                button.disabled = true;
                button.textContent = 'Withdrawing...';
            }
        });
    });

    // Fade in effect for grid
    const grid = document.querySelector('.events-grid');
    if (grid) {
        grid.style.opacity = 0;
        setTimeout(() => {
            grid.style.transition = 'opacity 0.6s ease';
            grid.style.opacity = 1;
        }, 100);
    }
});
