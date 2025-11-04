// Enhanced Global Reviews Database with Email Workflow
// File: /website-root/global-db.js

window.ReviewsDB = {
    reviews: [],
    
    // CRUD Operations with Email Integration
    create(reviewData) {
        // Reviews now go through email approval process
        // This is handled by ReviewManager.storePendingReview()
        if (window.ReviewManager) {
            const reviewId = this.getNextId();
            return window.ReviewManager.storePendingReview({
                ...reviewData,
                id: reviewId,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
        } else {
            // Fallback for direct creation (backwards compatibility)
            const newReview = {
                id: this.getNextId(),
                fullName: reviewData.fullName,
                email: reviewData.email,
                relationship: reviewData.relationship,
                review: reviewData.review,
                timestamp: new Date().toISOString(),
                status: 'approved'
            };
            this.reviews.push(newReview);
            this.notifyObservers();
            return newReview;
        }
    },
    
    read() {
        // Always return current approved reviews
        if (window.ReviewManager) {
            return window.ReviewManager.getApprovedReviews();
        }
        return [...this.reviews]; // Return copy to prevent direct manipulation
    },
    
    update(id, updatedData) {
        const reviews = this.read();
        const index = reviews.findIndex(review => review.id === id);
        if (index !== -1) {
            const updatedReview = { ...reviews[index], ...updatedData };
            
            // Update in storage
            if (window.ReviewManager) {
                const approvedReviews = window.ReviewManager.getApprovedReviews();
                const approvedIndex = approvedReviews.findIndex(r => r.id === id);
                if (approvedIndex !== -1) {
                    approvedReviews[approvedIndex] = updatedReview;
                    localStorage.setItem(window.ReviewManager.APPROVED_KEY, JSON.stringify(approvedReviews));
                    this.notifyObservers();
                }
            } else {
                this.reviews[index] = updatedReview;
                this.notifyObservers();
            }
            return updatedReview;
        }
        return null;
    },
    
    delete(id) {
        if (window.ReviewManager) {
            const approvedReviews = window.ReviewManager.getApprovedReviews();
            const index = approvedReviews.findIndex(review => review.id === id);
            if (index !== -1) {
                const deleted = approvedReviews.splice(index, 1)[0];
                localStorage.setItem(window.ReviewManager.APPROVED_KEY, JSON.stringify(approvedReviews));
                this.notifyObservers();
                return deleted;
            }
        } else {
            const index = this.reviews.findIndex(review => review.id === id);
            if (index !== -1) {
                const deleted = this.reviews.splice(index, 1)[0];
                this.notifyObservers();
                return deleted;
            }
        }
        return null;
    },
    
    getNextId() {
        const reviews = this.read();
        const pending = window.ReviewManager ? window.ReviewManager.getPendingReviews() : [];
        const allReviews = [...reviews, ...pending];
        
        if (allReviews.length === 0) return 1;
        
        const numericIds = allReviews
            .map(r => typeof r.id === 'string' ? parseInt(r.id.replace(/\D/g, '')) : r.id)
            .filter(id => !isNaN(id));
            
        return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    },
    
    // Observer pattern for real-time updates
    observers: [],
    
    addObserver(callback) {
        this.observers.push(callback);
    },
    
    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    },
    
    notifyObservers() {
        const currentReviews = this.read();
        this.observers.forEach(callback => {
            try {
                callback(currentReviews);
            } catch (error) {
                console.error('Error in observer callback:', error);
            }
        });
    },

    // Initialize the database
    init() {
        if (window.ReviewManager) {
            // Load approved reviews from ReviewManager
            this.reviews = window.ReviewManager.getApprovedReviews();
        }
        console.log('ReviewsDB initialized with', this.reviews.length, 'reviews');
    }
};

// Form handling functionality (enhanced)
function initializeReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    const successMessage = document.getElementById('successMessage');
    
    if (!reviewForm) return; // Exit if form doesn't exist on current page
    
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            fullName: reviewForm.fullName.value.trim(),
            email: reviewForm.email.value.trim(),
            relationship: reviewForm.relationship.value.trim(),
            review: reviewForm.review.value.trim()
        };
        
        // Validate form data
        if (!formData.fullName || !formData.email || !formData.relationship || !formData.review) {
            console.error('Missing required fields');
            return;
        }

        if (formData.review.length < 10) {
            console.error('Review too short');
            return;
        }
        
        try {
            // Create new review (goes through email approval process)
            const success = window.ReviewsDB.create(formData);
            
            if (success) {
                // Reset form and show success message
                reviewForm.reset();
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                    setTimeout(() => successMessage.classList.add('hidden'), 5000);
                }
                
                console.log('Review submitted for approval');
            } else {
                throw new Error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            // Show error message if available
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) {
                errorMessage.classList.remove('hidden');
                setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            }
        }
    });
}

// Index page carousel functionality (enhanced)
function initializeIndexCarousel() {
    const carousel = document.querySelector('.carousel-class');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!carousel) return; // Exit if carousel doesn't exist on current page
    
    let currentIndex = 0;
    let autoSlide;
    
    function updateCarouselDisplay() {
        const reviews = window.ReviewsDB.read();
        
        // Clear existing carousel content
        carousel.innerHTML = '';
        
        if (reviews.length === 0) {
            carousel.innerHTML = '<div class="moving-carousel active"><p>No reviews available yet. Be the first to share your experience!</p></div>';
            return;
        }
        
        // Populate carousel with reviews
        reviews.forEach((review, index) => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('moving-carousel');
            if (index === currentIndex) {
                reviewElement.classList.add('active');
            }
            
            // Truncate long reviews for carousel display
            const truncatedReview = review.review.length > 150 
                ? review.review.substring(0, 150) + '...' 
                : review.review;
            
            reviewElement.innerHTML = `
                <p>"${truncatedReview}"</p>
                <h3>${review.fullName}</h3>
                <p class="subtitle">${review.relationship}</p>
            `;
            
            carousel.appendChild(reviewElement);
        });
        
        updateCarouselPosition();
    }
    
    function updateCarouselPosition() {
        const cards = document.querySelectorAll('.moving-carousel');
        const carouselContainer = document.querySelector('.carousel-container');
        
        if (cards.length === 0) return;
        
        // Ensure currentIndex is within bounds
        if (currentIndex >= cards.length) {
            currentIndex = 0;
        }
        
        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentIndex) {
                card.classList.add('active');
            }
        });
        
        // Calculate offset for centering
        if (carouselContainer && cards[0]) {
            const cardWidth = cards[0].offsetWidth + 32; // Card width + margin
            const containerWidth = carouselContainer.offsetWidth;
            const offset = -(currentIndex * cardWidth) + (containerWidth / 2) - (cardWidth / 2);
            carousel.style.transform = `translateX(${offset}px)`;
        }
    }
    
    function moveNext() {
        const reviews = window.ReviewsDB.read();
        if (reviews.length > 0) {
            currentIndex = (currentIndex + 1) % reviews.length;
            updateCarouselPosition();
        }
    }
    
    function movePrev() {
        const reviews = window.ReviewsDB.read();
        if (reviews.length > 0) {
            currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
            updateCarouselPosition();
        }
    }
    
    function startAutoSlide() {
        autoSlide = setInterval(moveNext, 4000); // Changed to 4 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlide);
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            movePrev();
            stopAutoSlide();
            setTimeout(startAutoSlide, 2000); // Restart auto-slide after 2 seconds
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            moveNext();
            stopAutoSlide();
            setTimeout(startAutoSlide, 2000); // Restart auto-slide after 2 seconds
        });
    }
    
    // Pause auto-slide on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Handle touch events for mobile
    let startX = 0;
    let endX = 0;
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carouselContainer.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
        });
        
        carouselContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    moveNext(); // Swipe left = next
                } else {
                    movePrev(); // Swipe right = previous
                }
                stopAutoSlide();
                setTimeout(startAutoSlide, 2000);
            }
        });
    }
    
    // Update on window resize
    window.addEventListener('resize', () => {
        setTimeout(updateCarouselPosition, 100);
    });
    
    // Listen for database changes
    window.ReviewsDB.addObserver(() => {
        updateCarouselDisplay();
    });
    
    // Initial setup
    updateCarouselDisplay();
    
    // Start auto-slide only if there are reviews
    const reviews = window.ReviewsDB.read();
    if (reviews.length > 1) {
        startAutoSlide();
    }
}

// Initialize appropriate functionality based on current page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize database first
    window.ReviewsDB.init();
    
    // Then initialize UI components
    initializeReviewForm();
    initializeIndexCarousel();
    
    console.log('Global DB initialized');
});

// Make functions globally available for testing
window.initializeReviewForm = initializeReviewForm;
window.initializeIndexCarousel = initializeIndexCarousel;