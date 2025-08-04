// Enhanced admissions.js with scroll-based navigation functionality

// Navigation scroll hide/show functionality
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
let scrollTimeout;

function handleNavbarScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Clear any existing timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Add scrolling class for transition effects
    navbar.classList.add('scrolling');
    
    // Remove scrolling class after scroll stops
    scrollTimeout = setTimeout(() => {
        navbar.classList.remove('scrolling');
    }, 150);
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down & past 100px
        navbar.classList.add('nav-hidden');
        navbar.classList.remove('nav-visible');
    } else if (scrollTop < lastScrollTop) {
        // Scrolling up
        navbar.classList.remove('nav-hidden');
        navbar.classList.add('nav-visible');
    }
    
    // When at the very top, ensure navbar is visible
    if (scrollTop <= 0) {
        navbar.classList.remove('nav-hidden', 'nav-visible');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
}

// Throttle function for better performance  
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Enhanced toggle menu function with better mobile support
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    const isActive = navLinks.classList.contains('active');
    
    navLinks.classList.toggle('active');
    
    // When mobile menu is open, prevent navbar from hiding
    if (!isActive) {
        // Menu is being opened
        navbar.classList.add('menu-open');
        navbar.classList.remove('nav-hidden');
        navbar.classList.add('nav-visible');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        // Menu is being closed
        navbar.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Function to close mobile menu when clicking outside
function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navbar.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// Function to set active navigation link based on current page
function setActiveNavLink() {
    // Get current page filename
    const currentPage = window.location.pathname.split("/").pop() || "admissions.html";
  
    // Remove .html extension for comparison
    const pageName = currentPage.replace(".html", "") || "admissions";
  
    // Map page names to data-page values
    const pageMap = {
      index: "index",
      "": "index",
      about: "about",
      academics: "academics",
      admissions: "admissions",
      campus: "campus",
      contact: "contact",
    };
  
    // Get the corresponding data-page value
    const dataPage = pageMap[pageName] || "admissions";
  
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });
  
    // Add active class to current page link
    const activeLink = document.querySelector(
      `.nav-links a[data-page="${dataPage}"]`
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
}

// Original admissions step functionality
function showStep(stepNumber, element) {
    // Only run for non-mobile viewports
    if (window.innerWidth >= 768) {
        // Reset all circles and content
        document.querySelectorAll('.step-circle').forEach(circle => {
            circle.classList.remove('active');
            circle.style.backgroundColor = '#e5e7eb';
            circle.style.color = '#2563eb';
            circle.style.borderColor = '#2563eb';
        });
        document.querySelectorAll('.process-box .step-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById('process-box').classList.remove('active');

        // Activate selected circle and content
        element.classList.add('active');
        element.style.backgroundColor = '#2563eb';
        element.style.color = 'white';
        element.style.borderColor = '#facc15';
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        document.getElementById('process-box').classList.add('active');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll-based navigation functionality
    if (navbar) {
        // Use throttled scroll handler for better performance
        window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
        
        // Ensure navbar starts in correct position
        navbar.classList.add('nav-visible');
        
        // Add accessibility attributes
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.setAttribute('aria-label', 'Toggle navigation menu');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        const navbarElement = document.querySelector('.navbar');
        
        // Check if click is outside navbar and menu is open
        if (!navbarElement.contains(event.target) && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const navLinks = document.querySelector('.nav-links');
        
        // Close mobile menu if window is resized to desktop view
        if (window.innerWidth > 970 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navLinksContainer = document.querySelector('.nav-links');
            if (navLinksContainer.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    });
    
    // Set active navigation link on page load
    setActiveNavLink();

    // Initialize first step for non-mobile viewports (original functionality)
    if (window.innerWidth >= 768) {
        const firstCircle = document.querySelector('.step-circle.active');
        if (firstCircle) {
            showStep(1, firstCircle);
        }
    }

    // Original scroll-based animations using IntersectionObserver
    const animateElements = document.querySelectorAll('.animate-in');
    const programCards = document.querySelectorAll('.program-card');
    const facultyCards = document.querySelectorAll('.faculty-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('program-card') || entry.target.classList.contains('faculty-card')) {
                    entry.target.style.animationDelay = `${entry.target.dataset.delay}s`;
                    entry.target.classList.add('slide-in-up');
                } else {
                    entry.target.style.animationDelay = `${entry.target.dataset.delay || 0}s`;
                    entry.target.classList.add('animate-in-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    animateElements.forEach((el, i) => {
        el.dataset.delay = (i * 0.15).toString();
        observer.observe(el);
    });

    programCards.forEach(card => {
        observer.observe(card);
    });

    facultyCards.forEach(card => {
        observer.observe(card);
    });
});

// Update step display on resize (original functionality)
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        const activeCircle = document.querySelector('.step-circle.active');
        if (activeCircle) {
            const stepNumber = activeCircle.getAttribute('onclick').match(/\d+/)[0];
            showStep(stepNumber, activeCircle);
        }
    } else {
        document.querySelectorAll('.process-box .step-content').forEach(content => {
            content.classList.remove('active');
        });
        const processBox = document.getElementById('process-box');
        if (processBox) {
            processBox.classList.remove('active');
        }
    }
});

// Touch event handling for better mobile experience
document.addEventListener('DOMContentLoaded', () => {
    // Add touch event listeners for mobile menu
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks) {
        let startY = 0;
        
        navLinks.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        navLinks.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const diff = startY - currentY;
            
            // If user is scrolling up significantly, close the menu
            if (diff > 50) {
                closeMobileMenu();
            }
        }, { passive: true });
    }
    
    // Improve button tap targets for mobile
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(button => {
        button.style.minHeight = '44px'; // iOS recommended tap target size
        button.style.minWidth = '44px';
    });
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Failed to load image:', this.src);
        });
    });
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle resize-specific operations
            const navLinks = document.querySelector('.nav-links');
            if (window.innerWidth > 970 && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        }, 150);
    });
});