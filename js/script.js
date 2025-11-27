// Enhanced counter animation for stats
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false; // Flag to prevent multiple animations
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
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
                // Add plus sign if needed
                if (!counter.querySelector('.stat-plus') && !counter.classList.contains('percent')) {
                    const plusSpan = document.createElement('span');
                    plusSpan.className = 'stat-plus';
                    plusSpan.textContent = '+';
                    counter.parentNode.appendChild(plusSpan);
                }
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
    
    animated = true;
}

// Improved Intersection Observer with better configuration
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation only for achievement-stats section
                if (entry.target.classList.contains('achievement-stats')) {
                    // Small delay to ensure section is fully in view
                    setTimeout(() => {
                        animateCounter();
                    }, 300);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('scroll-animate');
        observer.observe(section);
    });
}

// Alternative simple counter animation (more reliable)
function simpleCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 50; // Lower is faster
    
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
                // Add plus sign if needed
                if (!counter.querySelector('.stat-plus') && !counter.classList.contains('percent')) {
                    const plusSpan = document.createElement('span');
                    plusSpan.className = 'stat-plus';
                    plusSpan.textContent = '+';
                    counter.parentNode.appendChild(plusSpan);
                }
            }
        }
        
        update();
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing animations');
    
    // Add CSS for animations first
    addDynamicStyles();
    
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
    
    // Test function - you can call this in console to debug
    window.debugCounter = function() {
        console.log('Debug: Manually triggering counter animation');
        simpleCounterAnimation();
    };
});

// Add dynamic CSS styles with better animation support
function addDynamicStyles() {
    const styles = `
        /* Scroll animations */
        .scroll-animate {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Counter animation styles */
        .stat-number {
            font-variant-numeric: tabular-nums; /* Better number alignment */
        }
        
        .stat-content {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 5px;
        }
        
        .stat-plus {
            font-size: 2rem;
            font-weight: 700;
            color: var(--secondary-blue);
        }
        
        /* Ensure stats section is visible */
        .achievement-stats {
            visibility: visible !important;
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
    `;
    
    // Remove existing style if any
    const existingStyle = document.getElementById('dynamic-styles');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'dynamic-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Mobile Navigation (existing code)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }));
}

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

// Sticky header
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

// Force counter animation on window load as fallback
window.addEventListener('load', function() {
    console.log('Window loaded - checking for counters');
    
    // Additional fallback
    setTimeout(() => {
        const counters = document.querySelectorAll('.stat-number');
        let allCountersZero = true;
        
        counters.forEach(counter => {
            if (counter.textContent !== '0') {
                allCountersZero = false;
            }
        });
        
        if (allCountersZero) {
            console.log('Counters still at 0, triggering fallback animation');
            simpleCounterAnimation();
        }
    }, 2000);
});

// Debug function to check counter elements
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
    
    const statsSection = document.querySelector('.achievement-stats');
    console.log('Stats section:', {
        element: statsSection,
        isInViewport: isElementInViewport(statsSection),
        hasAnimateClass: statsSection?.classList.contains('animate-in')
    });
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Make debug functions available globally
window.checkCounters = checkCounters;
window.manualAnimate = simpleCounterAnimation;
