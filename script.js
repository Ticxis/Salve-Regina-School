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

// Enhanced toggle menu function with scroll awareness
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const isActive = navLinks.classList.contains('active');
    
    navLinks.classList.toggle('active');
    
    // When mobile menu is open, prevent navbar from hiding
    if (!isActive) {
        // Menu is being opened
        navbar.classList.add('menu-open');
        navbar.classList.remove('nav-hidden');
        navbar.classList.add('nav-visible');
    } else {
        // Menu is being closed
        navbar.classList.remove('menu-open');
    }
}

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

    observer.observe(aboutSection);
});

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

    observer.observe(academicsSection);
});

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

// Intersection Observer to trigger animation when section is in view
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

// Intersection Observer to trigger animations when section is in view
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

document.addEventListener('DOMContentLoaded', () => {
    // Use throttled scroll handler for better performance
    window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
    
    // Ensure navbar starts in correct position
    if (navbar) navbar.classList.add('nav-visible');
    
    // Scroll-to-top for Home links
    const homeLinks = document.querySelectorAll('a[href="#home"]');
    homeLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            if (document.querySelector('.nav-links').classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navLinksContainer = document.querySelector('.nav-links');
            if (navLinksContainer.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Intersection Observer for animations
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
            threshold: 0.1 // Trigger when 10% of element is visible
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
            // Type "School"
            typeWriter("SRS", 100, () => {
                setTimeout(() => {
                    // Delete "School"
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

// PRESERVED ANIMATED COUNTER - This section is kept exactly as original to prevent conflicts
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