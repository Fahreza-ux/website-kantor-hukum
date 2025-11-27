// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }));
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active') && 
        !e.target.closest('.nav-menu') && 
        !e.target.closest('.hamburger')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Sticky header with background change
window.addEventListener('scroll', () => {
    const header = document.querySelector('.navbar');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Enhanced counter animation for stats
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation for achievement stats
                if (entry.target.classList.contains('achievement-stats')) {
                    animateCounter();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('scroll-animate');
        observer.observe(section);
    });

    // Observe cards for staggered animation
    const cards = document.querySelectorAll('.partner-card, .associate-card, .expertise-item, .stat-card, .story-card, .testimonial-card');
    cards.forEach((card, index) => {
        card.style.setProperty('--delay', `${index * 0.1}s`);
        observer.observe(card);
    });
}

// Lawyer filter functionality
function initLawyerFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lawyerCards = document.querySelectorAll('.associate-card, .partner-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                lawyerCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                    } else {
                        const specialties = card.getAttribute('data-specialties');
                        if (specialties && specialties.includes(filterValue)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
                
                // Animate visible cards
                setTimeout(() => {
                    const visibleCards = document.querySelectorAll('.associate-card[style="display: block"], .partner-card[style="display: block"]');
                    visibleCards.forEach((card, index) => {
                        card.style.animationDelay = `${index * 0.1}s`;
                        card.classList.add('animate-in');
                    });
                }, 100);
            });
        });
    }
}

// Back to top button
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// Loading animation
function initLoadingAnimation() {
    document.body.classList.add('loading');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 500);
    });
}

// Form validation for contact page
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            let errorMessage = '';
            
            // Validation checks
            if (!name) {
                isValid = false;
                errorMessage += '• Nama lengkap harus diisi\n';
            }
            
            if (!email) {
                isValid = false;
                errorMessage += '• Email harus diisi\n';
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += '• Format email tidak valid\n';
            }
            
            if (!phone) {
                isValid = false;
                errorMessage += '• Nomor telepon harus diisi\n';
            }
            
            if (!service) {
                isValid = false;
                errorMessage += '• Jenis layanan harus dipilih\n';
            }
            
            if (!message) {
                isValid = false;
                errorMessage += '• Pesan harus diisi\n';
            }
            
            if (isValid) {
                // Simulate form submission
                showNotification('success', 'Terima kasih! Pesan Anda telah dikirim. Kami akan menghubungi Anda dalam 1x24 jam.');
                contactForm.reset();
            } else {
                showNotification('error', errorMessage);
            }
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Add show class after a delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLoadingAnimation();
    initScrollAnimations();
    initLawyerFilter();
    initBackToTop();
    initContactForm();
    
    // Add CSS for animations and components
    addDynamicStyles();
});

// Add dynamic CSS styles
function addDynamicStyles() {
    const styles = `
        /* Scroll animations */
        .scroll-animate {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .scroll-animate.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .partner-card,
        .associate-card,
        .expertise-item,
        .stat-card,
        .story-card,
        .testimonial-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease var(--delay, 0s);
        }
        
        .partner-card.animate-in,
        .associate-card.animate-in,
        .expertise-item.animate-in,
        .stat-card.animate-in,
        .story-card.animate-in,
        .testimonial-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Back to top button */
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--secondary-blue);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            background: var(--primary-blue);
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        /* Notifications */
        .notification {
            position: fixed;
            top: 100px;
            right: 30px;
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border-left: 4px solid var(--success-green);
            max-width: 400px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 10000;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .notification.error {
            border-left-color: #e53e3e;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-icon {
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        .notification-message {
            flex: 1;
            white-space: pre-line;
            line-height: 1.4;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Loading state */
        body.loading {
            overflow: hidden;
        }
        
        body.loading::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--white);
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.5s ease;
        }
        
        body.loaded::before {
            opacity: 0;
            pointer-events: none;
        }
        
        /* Sticky header enhancement */
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        /* Mobile menu body lock */
        body.menu-open {
            overflow: hidden;
        }
        
        /* Filter buttons */
        .filter-btn {
            padding: 0.8rem 1.5rem;
            border: 2px solid var(--secondary-blue);
            background: transparent;
            color: var(--secondary-blue);
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
        }
        
        .filter-btn.active,
        .filter-btn:hover {
            background: var(--secondary-blue);
            color: white;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Page is visible again, you could trigger animations here
        document.body.classList.add('page-visible');
    }
});

// Error boundary for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Performance monitoring (optional)
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        }, 0);
    });
}
