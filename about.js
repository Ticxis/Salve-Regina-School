// Enhanced about.js with scroll-based navigation functionality

// Navigation scroll hide/show functionality (from script.js)
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
    const currentPage = window.location.pathname.split('/').pop() || 'about.html';
    
    // Remove .html extension for comparison
    const pageName = currentPage.replace('.html', '') || 'about';
    
    // Map page names to data-page values
    const pageMap = {
        'index': 'index',
        '': 'index',
        'about': 'about',
        'academics': 'academics',
        'admissions': 'admissions',
        'campus': 'campus',
        'contact': 'contact'
    };
    
    // Get the corresponding data-page value
    const dataPage = pageMap[pageName] || 'about';
    
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

// Function to fetch board members data
async function fetchBoardMembers() {
    try {
        const response = await fetch('boardMembers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.boardMembers;
    } catch (error) {
        console.error('Error fetching board members:', error);
        return null;
    }
}

// Function to render board members
function renderBoardMembers(members) {
    const teamGrid = document.querySelector('.team-grid');
    
    if (!teamGrid || !members) {
        console.error('Team grid not found or no members data');
        return;
    }

    // Clear existing content
    teamGrid.innerHTML = '';

    // Render each member
    members.forEach((member, index) => {
        const memberCard = document.createElement('div');
        memberCard.className = 'team-card';
        memberCard.setAttribute('data-delay', (index * 0.3).toString());
        memberCard.setAttribute('data-member-id', member.id);
        
        memberCard.innerHTML = `
            <img src="${member.image}" alt="${member.name}" onerror="this.src='images/placeholder-avatar.jpg'">
            <h3>${member.name}</h3>
            <p class="member-title">${member.title}</p>
            <p class="member-excerpt">${member.excerpt}</p>
            <button class="read-more-btn" onclick="openMemberModal(${member.id})">
                <i class="fas fa-book-open"></i> Read More
            </button>
        `;

        teamGrid.appendChild(memberCard);
    });

    // Re-initialize observers and animations for dynamically created cards
    initializeTeamCardAnimations();
}

// Function to initialize team card animations
function initializeTeamCardAnimations() {
    const teamCards = document.querySelectorAll('.team-card');
    
    // Set up intersection observer for slide-in animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${entry.target.dataset.delay}s`;
                entry.target.classList.add('slide-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    teamCards.forEach(card => {
        observer.observe(card);
        
        // Add click pulse animation
        card.addEventListener('click', (e) => {
            // Don't trigger pulse if clicking the button
            if (!e.target.classList.contains('read-more-btn')) {
                card.style.animation = 'pulse 0.4s ease-in-out';
                setTimeout(() => {
                    card.style.animation = '';
                }, 400);
            }
        });

        // Enhanced hover animations
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Store board members data globally for modal access
let boardMembersData = [];

// Function to open member modal
function openMemberModal(memberId) {
    const member = boardMembersData.find(m => m.id === memberId);
    if (!member) {
        console.error('Member not found:', memberId);
        return;
    }

    // Populate modal content
    const modal = document.getElementById('memberModal');
    const modalImage = document.getElementById('modalMemberImage');
    const modalName = document.getElementById('modalMemberName');
    const modalTitle = document.getElementById('modalMemberTitle');
    const modalStory = document.getElementById('modalMemberStory');

    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    // Set content
    modalImage.src = member.image;
    modalImage.alt = member.name;
    modalImage.onerror = function() {
        this.src = 'images/placeholder-avatar.jpg';
    };
    modalName.textContent = member.name;
    modalTitle.textContent = member.title;
    modalStory.textContent = member.story;

    // Show modal with animation
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Trigger animation after display
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    // Add escape key listener
    document.addEventListener('keydown', handleModalEscape);
}

// Function to close member modal
function closeMemberModal() {
    const modal = document.getElementById('memberModal');
    if (!modal) return;

    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling

    // Hide modal after animation completes
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);

    // Remove escape key listener
    document.removeEventListener('keydown', handleModalEscape);
}

// Handle escape key press
function handleModalEscape(event) {
    if (event.key === 'Escape') {
        closeMemberModal();
    }
}

// Handle modal background click
function handleModalBackgroundClick(event) {
    if (event.target.classList.contains('member-modal')) {
        closeMemberModal();
    }
}

// Function to handle loading state
function showLoadingState() {
    const teamGrid = document.querySelector('.team-grid');
    if (!teamGrid) return;

    teamGrid.innerHTML = '';
    
    // Create loading skeleton cards
    for (let i = 0; i < 4; i++) {
        const loadingCard = document.createElement('div');
        loadingCard.className = 'team-card loading';
        loadingCard.innerHTML = `
            <div style="width: 170px; height: 170px; border-radius: 50%; background: #e0e0e0; margin: 0 auto 1rem;"></div>
            <div style="height: 20px; background: #e0e0e0; margin-bottom: 0.5rem; border-radius: 4px;"></div>
            <div style="height: 16px; background: #e0e0e0; margin-bottom: 0.5rem; border-radius: 4px; width: 80%;"></div>
            <div style="height: 14px; background: #e0e0e0; margin-bottom: 1rem; border-radius: 4px;"></div>
        `;
        teamGrid.appendChild(loadingCard);
    }
}

// Function to handle error state
function showErrorState() {
    const teamGrid = document.querySelector('.team-grid');
    if (!teamGrid) return;

    teamGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #e74c3c;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>Unable to load board members</h3>
            <p>Please refresh the page or try again later.</p>
            <button onclick="loadBoardMembers()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Try Again
            </button>
        </div>
    `;
}

// Main function to load board members
async function loadBoardMembers() {
    showLoadingState();
    
    const members = await fetchBoardMembers();
    
    if (members && members.length > 0) {
        boardMembersData = members; // Store data globally for modal access
        renderBoardMembers(members);
    } else {
        showErrorState();
    }
}

// Initialize modal functionality
function initializeModal() {
    // Prevent modal content clicks from closing modal
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (event) => {
            event.stopPropagation();
        });
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
    
    // Set active navigation link
    setActiveNavLink();
    
    // Load board members
    loadBoardMembers();
    
    // Initialize modal event listeners
    initializeModal();
    
    // Original animation code for other sections
    const animateElements = document.querySelectorAll('.animate-in');
    const missionCards = document.querySelectorAll('.mission-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('mission-card')) {
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

    missionCards.forEach(card => {
        observer.observe(card);
    });

    // Achievement card interactions
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('click', () => {
            card.style.animation = 'pulse 0.4s ease-in-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 400);
        });
    });

    // Mission card hover animation
    document.querySelectorAll('.mission-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
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