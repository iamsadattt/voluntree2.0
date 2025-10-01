// Home page specific JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===========================
        // Animate Stats Counter
        // ===========================
        const stats = document.querySelectorAll('.stat-number');
        let hasAnimated = false;

        function animateStats() {
            if (hasAnimated) return;

            const heroStats = document.querySelector('.hero-stats');
            if (!heroStats) return;

            const rect = heroStats.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

            if (isVisible) {
                hasAnimated = true;

                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    if (!target) return;

                    let current = 0;
                    const increment = target / 60; // 60 steps for smooth animation
                    const duration = 2000; // 2 seconds
                    const stepTime = duration / 60;

                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = formatNumber(target);
                            clearInterval(counter);
                        } else {
                            stat.textContent = formatNumber(Math.floor(current));
                        }
                    }, stepTime);
                });
            }
        }

        function formatNumber(num) {
            if (num >= 1000) {
                return (num / 1000).toFixed(0) + 'K+';
            }
            return num.toLocaleString() + '+';
        }

        // Check on scroll with debounce
        const debouncedAnimateStats = window.debounce ? window.debounce(animateStats, 100) : animateStats;
        window.addEventListener('scroll', debouncedAnimateStats);

        // Check on load
        animateStats();

        // ===========================
        // Intersection Observer for Fade-in Animations
        // ===========================
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe sections with initial hidden state
        const sections = document.querySelectorAll('.features, .about, .cta');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });

        // ===========================
        // Feature Cards Staggered Animation
        // ===========================
        const featureCards = document.querySelectorAll('.feature-card');

        const cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100); // Stagger by 100ms
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });

        // ===========================
        // Active Nav Link Based on Scroll
        // ===========================
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        function updateActiveNavLink() {
            let current = '';
            const sections = document.querySelectorAll('section[id]');

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop &&
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        const debouncedUpdateNav = window.debounce ? window.debounce(updateActiveNavLink, 100) : updateActiveNavLink;
        window.addEventListener('scroll', debouncedUpdateNav);

        // ===========================
        // Track CTA Button Clicks
        // ===========================
        const ctaButtons = document.querySelectorAll('[href*="register"]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Placeholder for analytics tracking
                if (typeof console !== 'undefined') {
                    console.log('CTA clicked:', this.textContent.trim());
                }
            });
        });

        // ===========================
        // Parallax Effect on Hero (Subtle)
        // ===========================
        const hero = document.querySelector('.hero-container');
        if (hero && window.innerWidth > 768) {
            let ticking = false;

            function updateParallax() {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                hero.style.transform = `translateY(${rate}px)`;
                ticking = false;
            }

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            });
        }

        // ===========================
        // Add Ripple Effect to Feature Cards
        // ===========================
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', function(e) {
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(79, 70, 229, 0.1);
                    width: 100px;
                    height: 100px;
                    margin-top: -50px;
                    margin-left: -50px;
                    animation: ripple 0.6s;
                    pointer-events: none;
                `;

                const rect = this.getBoundingClientRect();
                ripple.style.left = e.clientX - rect.left + 'px';
                ripple.style.top = e.clientY - rect.top + 'px';

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation CSS
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

    });

})();