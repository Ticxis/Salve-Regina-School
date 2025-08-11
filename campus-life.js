// Enhanced campus-life.js with scroll-based navigation functionality

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
    const currentPage = window.location.pathname.split("/").pop() || "campus.html";
  
    // Remove .html extension for comparison
    const pageName = currentPage.replace(".html", "") || "campus";
  
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
    const dataPage = pageMap[pageName] || "campus";
  
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

// Original Gallery functionality
const categoriesBtn = document.getElementById('categoriesBtn');
const showAllBtn = document.getElementById('showAllBtn');
const categoriesView = document.getElementById('categoriesView');
const allImagesView = document.getElementById('allImagesView');
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentImages = [];
let currentIndex = 0;
const slideshowInterval = 3000; // 3 seconds per slide

// Slideshow functionality
function startSlideshow(item) {
    try {
        const images = JSON.parse(item.getAttribute('data-images'));
        if (!Array.isArray(images) || images.length === 0) {
            console.warn('No valid images for slideshow:', item.getAttribute('data-caption'));
            return;
        }
        let index = 0;
        const imgElement = item.querySelector('.slideshow-img');
        if (!imgElement) return;

        setInterval(() => {
            index = (index + 1) % images.length;
            imgElement.src = images[index];
        }, slideshowInterval);
    } catch (error) {
        console.error('Error in slideshow for', item.getAttribute('data-caption'), ':', error);
    }
}

// Start slideshow for each gallery item
galleryItems.forEach(item => {
    startSlideshow(item);
    item.querySelector('.slideshow-img').addEventListener('error', () => {
        item.querySelector('.caption').textContent = 'Error: Image failed to load';
        item.querySelector('.caption').style.color = 'red';
    });

    item.addEventListener('click', () => {
        try {
            currentImages = JSON.parse(item.getAttribute('data-images'));
            if (!Array.isArray(currentImages) || currentImages.length === 0) {
                throw new Error('No valid images found');
            }
            currentIndex = 0;
            modalCaption.textContent = item.getAttribute('data-caption') || 'Gallery';
            updateModalImage();
            modal.style.display = 'flex';
        } catch (error) {
            modalImage.src = '';
            modalCaption.textContent = 'Error: Unable to load images. Check image paths or JSON format.';
            modal.style.display = 'flex';
        }
    });
});

function updateModalImage() {
    if (currentImages.length > 0) {
        modalImage.src = currentImages[currentIndex];
        prevBtn.disabled = currentImages.length <= 1;
        nextBtn.disabled = currentImages.length <= 1;
    }
}

function prevImage() {
    if (currentImages.length > 1) {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateModalImage();
    }
}

function nextImage() {
    if (currentImages.length > 1) {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateModalImage();
    }
}

function closeModal() {
    modal.style.display = 'none';
    currentImages = [];
    currentIndex = 0;
    modalImage.src = '';
    modalCaption.textContent = '';
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Toggle between views
function showCategories() {
    categoriesView.style.display = 'block';
    allImagesView.style.display = 'none';
    categoriesBtn.classList.add('active');
    showAllBtn.classList.remove('active');
}

function showAllImages() {
    categoriesView.style.display = 'none';
    allImagesView.style.display = 'grid';
    categoriesBtn.classList.remove('active');
    showAllBtn.classList.add('active');

    // Clear previous content
    allImagesView.innerHTML = '';

    // Collect all images
    galleryItems.forEach(item => {
        try {
            const images = JSON.parse(item.getAttribute('data-images'));
            const caption = item.getAttribute('data-caption');
            if (!Array.isArray(images)) return;

            images.forEach(image => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.innerHTML = `
                    <img src="${image}" alt="${caption}">
                    <div class="caption">${caption}</div>
                `;
                allImagesView.appendChild(imageItem);

                // Handle image load errors
                const img = imageItem.querySelector('img');
                img.addEventListener('error', () => {
                    imageItem.innerHTML = `<div class="error-message">Error: Image failed to load</div>`;
                });
            });
        } catch (error) {
            console.error('Error parsing images for', item.getAttribute('data-caption'), ':', error);
            const errorItem = document.createElement('div');
            errorItem.className = 'image-item';
            errorItem.innerHTML = `<div class="error-message">Error: Invalid image data for ${item.getAttribute('data-caption')}</div>`;
            allImagesView.appendChild(errorItem);
        }
    });
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

    // Button event listeners for original functionality
    if (categoriesBtn) categoriesBtn.addEventListener('click', showCategories);
    if (showAllBtn) showAllBtn.addEventListener('click', showAllImages);

    // Initial view
    showCategories();

    // Scroll animation for gallery items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-in forwards';
                entry.target.style.opacity = 1;
            }
        });
    }, { threshold: 0.2 });

    galleryItems.forEach(item => {
        item.style.opacity = 0;
        observer.observe(item);
    });

    // Handle image loading errors
    if (modalImage) {
        modalImage.addEventListener('error', () => {
            modalImage.src = '';
            modalCaption.textContent = 'Error: Image failed to load. Check the file path.';
        });
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

// Performance optimizations for mobile
document.addEventListener('DOMContentLoaded', () => {
    // Optimize scroll performance
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleNavbarScroll);
            ticking = true;
        }
    }
    
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