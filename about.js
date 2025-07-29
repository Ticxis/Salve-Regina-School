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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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

// Toggle menu function
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}