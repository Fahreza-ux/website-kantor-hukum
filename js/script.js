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
    let animated = false;
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        
        // Reset counter to 0 first
        counter.textContent = '0';
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentValue = Math.floor(easeOutQuart * target);
            counter.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
    
    animated = true;
}

// Alternative simple counter animation (more reliable)
function simpleCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 50;
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        
        // Reset to 0
        counter.textContent = '0';
        
        const increment = target / speed;
        
        function update() {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                setTimeout(update, 20);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }
        
        update();
    });
}

// Improved Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation only for achievement-stats section
                if (entry.target.classList.contains('achievement-stats')) {
                    setTimeout(() => {
                        animateCounter();
                    }, 300);
                }
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('scroll-animate');
        observer.observe(section);
    });

    // Observe cards for staggered animation
    const cards = document.querySelectorAll('.partner-card, .associate-card, .expertise-item, .stat-card, .story-card, .testimonial-card, .service-card, .service-category');
    cards.forEach((card, index) => {
        card.style.setProperty('--delay', `${index * 0.1}s`);
        card.classList.add('scroll-animate');
        observer.observe(card);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing animations');
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Fallback: If Intersection Observer doesn't work, animate after 1 second
    setTimeout(() => {
        const statsSection = document.querySelector('.achievement-stats');
        if (statsSection && !statsSection.classList.contains('animate-in')) {
            console.log('Fallback: Animating counters');
            simpleCounterAnimation();
        }
    }, 1000);
});

// Force counter animation on window load as fallback
window.addEventListener('load', function() {
    console.log('Window loaded - checking for counters');
    
    // Additional fallback
    setTimeout(() => {
        const counters = document.querySelectorAll('.stat-number');
        let allCountersZero = true;
        
        counters.forEach(counter => {
            if (counter.textContent !== '0' && counter.textContent !== '0+') {
                allCountersZero = false;
            }
        });
        
        if (allCountersZero) {
            console.log('Counters still at 0, triggering fallback animation');
            simpleCounterAnimation();
        }
    }, 2000);
});

// Debug functions
function checkCounters() {
    const counters = document.querySelectorAll('.stat-number');
    console.log('Found counters:', counters.length);
    
    counters.forEach((counter, index) => {
        console.log(`Counter ${index + 1}:`, {
            element: counter,
            dataCount: counter.getAttribute('data-count'),
            currentText: counter.textContent,
            isVisible: counter.offsetParent !== null
        });
    });
}

// Make debug functions available globally
window.checkCounters = checkCounters;
window.manualAnimate = simpleCounterAnimation;
