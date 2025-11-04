// FIXED SCRIPT.JS WITH CONSISTENT NAVBAR BEHAVIOR
// Navigation scroll hide/show functionality - CLEAN VERSION
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
let scrollTimeout;

// CLEAN navbar scroll handler (same as working pages)
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
    
    // CLEAN AND WORKING LOGIC (same as other pages)
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

// Enhanced throttle function for better performance
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

// Function to set active navigation link based on current page
function setActiveNavLink() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove .html extension for comparison
    const pageName = currentPage.replace('.html', '') || 'index';
    
    // Map page names to data-page values
    const pageMap = {
        'index': 'index',
        '': 'index', // For root path
        'about': 'about',
        'academics': 'academics',
        'admissions': 'admissions',
        'campus': 'campus',
        'contact': 'contact'
    };
    
    // Get the corresponding data-page value
    const dataPage = pageMap[pageName] || 'index';
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`.nav-links a[data-page="${dataPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Close mobile menu when clicking outside
function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    if(hamburger){
        hamburger.classList.remove('menu-active');    
        navLinks.classList.remove('active');
        navbar.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    
    // Check if click is outside navbar and menu is open
    if (!navbar.contains(event.target) && navLinks.classList.contains('active')) {
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

// About section animation observer
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('.about');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the section is visible
    });

    if (aboutSection) {
        observer.observe(aboutSection);
    }
});

// Academics section animation observer
document.addEventListener('DOMContentLoaded', () => {
    const academicsSection = document.querySelector('.academics');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.4 // Trigger when 40% of the section is visible
    });

    if (academicsSection) {
        observer.observe(academicsSection);
    }
});

// Gallery slider functionality
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const images = document.querySelectorAll('.slider img');
    const dotsContainer = document.querySelector('.dots');
    let currentIndex = 0;

    if (!slider || !images.length || !dotsContainer) return; // Safety check

    // Create dots
    images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateSlider();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateSlider();
        });
    }

    // Auto-slide every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        updateSlider();
    }, 5000);
});

// About section intersection observer
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('#about');
    if (!aboutSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing after animation triggers
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the section is visible
    });

    observer.observe(aboutSection);
});

// Academics section intersection observer
document.addEventListener('DOMContentLoaded', () => {
    const academicsSection = document.querySelector('#academics');
    if (!academicsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing after animation triggers
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the section is visible
    });

    observer.observe(academicsSection);
});

// Admissions section intersection observer
document.addEventListener('DOMContentLoaded', () => {
    const admissionsSection = document.querySelector('#admissions');
    if (!admissionsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing after animations trigger
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the section is visible
    });

    observer.observe(admissionsSection);
});

// Main DOMContentLoaded initialization - CLEAN VERSION
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll-based navigation functionality - CLEAN VERSION
    if (navbar) {
        // Use throttled scroll handler for better performance
        window.addEventListener('scroll', throttle(handleNavbarScroll, 10), { passive: true });
        
        // Ensure navbar starts in correct position
        navbar.classList.add('nav-visible');
        
        // Add accessibility attributes
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.setAttribute('aria-label', 'Toggle navigation menu');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Set active navigation link on page load
    setActiveNavLink();
    
    // Add accessibility attributes
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    
    // Set active navigation link on page load
    setActiveNavLink();
    
    // Scroll-to-top for Home links
    const homeLinks = document.querySelectorAll('a[href="#home"], a[href="index.html#home"]');
    homeLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            if (document.querySelector('.nav-links').classList.contains('active')) {
                closeMobileMenu();
            }
        });
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

    // Intersection Observer for animations with improved performance
    const animatedElements = document.querySelectorAll('.typewriter, .step');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.dataset.animationDelay || '0s';
                    element.style.transitionDelay = delay;
                    element.classList.add('visible');
                    observer.unobserve(element);
                }
            });
        },
        {
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '50px' // Start animation 50px before element enters viewport
        }
    );

    animatedElements.forEach(element => observer.observe(element));
});

// Typewriter Animation
const typewriterElement = document.getElementById('typewriter');
const cursorElement = document.getElementById('cursor');

if (typewriterElement && cursorElement) {
    function typeWriter(text, speed, callback) {
        let i = 0;
        function type() {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                callback();
            }
        }
        type();
    }

    function deleteText(speed, callback) {
        let text = typewriterElement.textContent;
        function del() {
            if (text.length > 0) {
                text = text.slice(0, -1);
                typewriterElement.textContent = text;
                setTimeout(del, speed);
            } else {
                callback();
            }
        }
        del();
    }

    // Animation Sequence
    setTimeout(() => {
        // After "Welcome to" fade-in (2s), start cursor blinking
        cursorElement.style.animation = 'blink 0.5s step-end 5'; // Blink 5 times
        setTimeout(() => {
            cursorElement.style.animation = ''; // Stop blinking
            // Type "SRS"
            typeWriter("SRS", 100, () => {
                setTimeout(() => {
                    // Delete "SRS"
                    deleteText(100, () => {
                        // Type "Salve Regina School"
                        typeWriter("Salve Regina School", 100, () => {
                            // Remove cursor after typing is complete
                            cursorElement.style.display = 'none';
                        });
                    });
                }, 500); // Pause before deleting
            });
        }, 2500); // 5 blinks * 0.5s = 2.5s
    }, 2000); // Wait for "Welcome to" fade-in
}

// ANIMATED COUNTER - This section is kept exactly as original to prevent conflicts
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Adjust speed of animation (lower is faster)

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;

        const updateCount = () => {
            const count = +counter.innerText;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
});

// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical images
    const criticalImages = [
        'images/image2.jpg', // Hero background
        'images/srs_logo.png' // Logo
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
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
            // You can add a placeholder or error handling here
            console.warn('Failed to load image:', this.src);
        });
    });
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Service Worker registration for better caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ==================== ENHANCED ADMISSIONS SECTION FUNCTIONALITY ====================

// Enhanced Admissions Intersection Observer for animations
document.addEventListener('DOMContentLoaded', () => {
    // Enhanced admissions animation observer
    const enhancedObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const enhancedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                enhancedObserver.unobserve(entry.target);
            }
        });
    }, enhancedObserverOptions);

    // Observe all enhanced animation elements
    const enhancedAnimatedElements = document.querySelectorAll('.fade-in-enhanced, .slide-in-left-enhanced, .slide-in-right-enhanced');
    enhancedAnimatedElements.forEach(el => enhancedObserver.observe(el));

    // Add staggered animation delays for enhanced admissions
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const steps = document.querySelectorAll('.step-enhanced');
    steps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.2}s`;
    });

    const requirementItems = document.querySelectorAll('.requirement-item');
    requirementItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // Timeline items staggered animation
    const timelineItems = document.querySelectorAll('.timeline-item .timeline-content');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
    });
});
