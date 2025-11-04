// Enhanced admissions.js with triangle pointer functionality

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
        hamburger.classList.add('menu-active');
        navbar.classList.remove('nav-hidden');
        navbar.classList.add('nav-visible');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        // Menu is being closed
        navbar.classList.remove('menu-open');
        hamburger.classList.remove('menu-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Function to close mobile menu when clicking outside
function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    // if (navLinks.classList.contains('active')) {
    if(hamburger){
        hamburger.classList.remove('menu-active');    
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

// ===== ENHANCED ADMISSION STEP FUNCTIONALITY WITH TRIANGLE POINTER =====

// Enhanced showStep function with triangle positioning
function showStep(stepNumber, element) {
    // Only run for non-mobile viewports
    if (window.innerWidth >= 768) {
        // Reset all circles and content
        document.querySelectorAll('.step-circle').forEach(circle => {
            circle.classList.remove('active');
            // Reset inline styles to let CSS handle the styling
            circle.style.backgroundColor = '';
            circle.style.color = '';
            circle.style.borderColor = '';
        });
        document.querySelectorAll('.process-box .step-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById('process-box').classList.remove('active');

        // Activate selected circle and content
        element.classList.add('active');
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        document.getElementById('process-box').classList.add('active');
        
        // ===== KEY ADDITION: Position triangle pointer =====
        positionTriangle(stepNumber);
    }
}

// ===== NEW FUNCTION: Triangle positioning logic =====
function positionTriangle(stepNumber) {
    const circles = document.querySelectorAll('.step-circle');
    const triangle = document.getElementById('trianglePointer');
    const processBox = document.getElementById('process-box');
    
    // Safety checks
    if (!triangle || !processBox || stepNumber < 1 || stepNumber > circles.length) {
        console.warn('Triangle positioning failed: missing elements or invalid step number');
        return;
    }

    // Get the target circle
    const targetCircle = circles[stepNumber - 1];
    
    try {
        // Calculate positions using getBoundingClientRect for accuracy
        const circleRect = targetCircle.getBoundingClientRect();
        const boxRect = processBox.getBoundingClientRect();
        
        // Calculate the relative position of circle center to process box
        const relativeLeft = circleRect.left - boxRect.left + (circleRect.width / 2);
        
        // Position triangle (CSS transform handles centering)
        triangle.style.left = relativeLeft + 'px';
        
        // Debug logging (remove in production if desired)
        console.log(`Triangle positioned for step ${stepNumber} at ${relativeLeft}px`);
        
    } catch (error) {
        console.error('Error positioning triangle:', error);
    }
}

// ===== KEYBOARD NAVIGATION SUPPORT =====
function handleKeyboardNavigation(event) {
    if (window.innerWidth >= 768) {
        const circles = document.querySelectorAll('.step-circle');
        const activeCircle = document.querySelector('.step-circle.active');
        
        if (activeCircle && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
            event.preventDefault();
            
            const currentIndex = Array.from(circles).indexOf(activeCircle);
            let newIndex;
            
            if (event.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : circles.length - 1;
            } else {
                newIndex = currentIndex < circles.length - 1 ? currentIndex + 1 : 0;
            }
            
            showStep(newIndex + 1, circles[newIndex]);
        }
    }
}

// ===== VALIDATION AND ERROR HANDLING =====
function validateTriangleSystem() {
    const requiredElements = [
        { selector: '#trianglePointer', name: 'Triangle Pointer' },
        { selector: '#process-box', name: 'Process Box' },
        { selector: '.step-circle', name: 'Step Circles' },
        { selector: '.step-content', name: 'Step Content' }
    ];
    
    const missing = requiredElements.filter(element => !document.querySelector(element.selector));
    
    if (missing.length > 0) {
        console.error('Triangle system validation failed. Missing elements:', missing.map(el => el.name));
        return false;
    }
    
    console.log('Triangle system validation passed ✓');
    return true;
}

// ===== ENHANCED INITIALIZATION =====
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

    // Add keyboard navigation for steps
    document.addEventListener('keydown', handleKeyboardNavigation);

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

    // ===== INITIALIZE TRIANGLE SYSTEM =====
    // Initialize triangle position for first step
    if (window.innerWidth >= 768) {
        const firstCircle = document.querySelector('.step-circle.active');
        if (firstCircle) {
            // Small delay to ensure layout is complete
            setTimeout(() => {
                showStep(1, firstCircle);
            }, 100);
        }
    }

    // Validate triangle system
    setTimeout(validateTriangleSystem, 500);

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

// ===== ENHANCED RESIZE HANDLING =====
let triangleRepositionTimeout;

window.addEventListener('resize', () => {
    // Original resize handling
    if (window.innerWidth >= 768) {
        const activeCircle = document.querySelector('.step-circle.active');
        if (activeCircle) {
            const circles = Array.from(document.querySelectorAll('.step-circle'));
            const stepNumber = circles.indexOf(activeCircle) + 1;
            
            // Debounce the repositioning for better performance
            clearTimeout(triangleRepositionTimeout);
            triangleRepositionTimeout = setTimeout(() => {
                positionTriangle(stepNumber);
            }, 150);
        }
    } else {
        // Clean up desktop states on mobile
        document.querySelectorAll('.process-box .step-content').forEach(content => {
            content.classList.remove('active');
        });
        const processBox = document.getElementById('process-box');
        if (processBox) {
            processBox.classList.remove('active');
        }
    }

    // Handle mobile menu on resize
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth > 970 && navLinks.classList.contains('active')) {
        closeMobileMenu();
    }
});

// ===== TOUCH EVENT HANDLING =====
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

// ===== ERROR HANDLING =====
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

// ===== PERFORMANCE OPTIMIZATIONS =====
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
            
            // Reposition triangle if needed
            if (window.innerWidth >= 768) {
                const activeCircle = document.querySelector('.step-circle.active');
                if (activeCircle) {
                    const circles = Array.from(document.querySelectorAll('.step-circle'));
                    const stepNumber = circles.indexOf(activeCircle) + 1;
                    positionTriangle(stepNumber);
                }
            }
        }, 150);
    });
});

// ===== OPTIONAL: AUTO-DEMO FUNCTIONALITY =====
function startAutoDemo() {
    if (window.innerWidth >= 768) {
        let currentStep = 1;
        const maxSteps = 6;
        
        const autoAdvance = () => {
            const circles = document.querySelectorAll('.step-circle');
            showStep(currentStep, circles[currentStep - 1]);
            
            currentStep = currentStep >= maxSteps ? 1 : currentStep + 1;
        };
        
        // Start demo
        const demoInterval = setInterval(autoAdvance, 3000);
        
        // Stop demo after one full cycle
        setTimeout(() => {
            clearInterval(demoInterval);
        }, 18000);
        
        return demoInterval;
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels to step circles
    const circles = document.querySelectorAll('.step-circle');
    circles.forEach((circle, index) => {
        const stepTitle = circle.parentElement.querySelector('.step-title').textContent;
        circle.setAttribute('aria-label', `Step ${index + 1}: ${stepTitle}`);
        circle.setAttribute('role', 'button');
        circle.setAttribute('tabindex', '0');
        
        // Add keyboard support for circles
        circle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showStep(index + 1, circle);
            }
        });
    });
    
    // Add ARIA live region for content changes
    const processBox = document.getElementById('process-box');
    if (processBox) {
        processBox.setAttribute('aria-live', 'polite');
        processBox.setAttribute('aria-label', 'Admission process step details');
    }
});