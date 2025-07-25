// Unified Reviews System - Works across all pages
class ReviewsManager {
    constructor() {
        this.storageKey = 'school_reviews';
        this.defaultReviews = [
            {
                id: 1,
                fullName: 'Sarah Johnson',
                email: 'sarah.j@example.com',
                relationship: 'Parent of 5th Grader',
                review: 'This school has transformed my child\'s learning experience. The teachers are dedicated and inspiring!',
                timestamp: new Date('2024-01-15').toISOString()
            },
            {
                id: 2,
                fullName: 'Michael Lee',
                email: 'michael.l@example.com',
                relationship: 'Parent of 8th Grader',
                review: 'The community here is amazing. My daughter loves the extracurricular activities!',
                timestamp: new Date('2024-02-10').toISOString()
            },
            {
                id: 3,
                fullName: 'Emily Davis',
                email: 'emily.d@example.com',
                relationship: 'Parent of 3rd Grader',
                review: 'I appreciate the school\'s focus on both academics and character development.',
                timestamp: new Date('2024-02-20').toISOString()
            },
            {
                id: 4,
                fullName: 'James Patel',
                email: 'james.p@example.com',
                relationship: 'Parent of 6th Grader',
                review: 'The support for students with diverse needs is outstanding. Truly inclusive!',
                timestamp: new Date('2024-03-05').toISOString()
            },
            {
                id: 5,
                fullName: 'Laura Chen',
                email: 'laura.c@example.com',
                relationship: 'Parent of 4th Grader',
                review: 'The school\'s communication with parents is top-notch. Always informed!',
                timestamp: new Date('2024-03-12').toISOString()
            }
        ];
        
        this.currentIndex = 0;
        this.init();
    }

    // Initialize the system
    init() {
        this.loadReviews();
        this.setupFormHandler();
        this.setupCarousel();
        this.displayReviews();
    }

    // Load reviews from localStorage or use defaults
    loadReviews() {
        const storedReviews = localStorage.getItem(this.storageKey);
        if (storedReviews) {
            this.reviews = JSON.parse(storedReviews);
        } else {
            this.reviews = [...this.defaultReviews];
            this.saveReviews();
        }
    }

    // Save reviews to localStorage
    saveReviews() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.reviews));
    }

    // Add a new review
    addReview(reviewData) {
        const newReview = {
            id: Date.now(), // Use timestamp as unique ID
            fullName: reviewData.fullName,
            email: reviewData.email,
            relationship: reviewData.relationship,
            review: reviewData.review,
            timestamp: new Date().toISOString()
        };

        this.reviews.push(newReview);
        this.saveReviews();
        this.displayReviews();
        return newReview;
    }

    // Setup form submission handler (for form.html)
    setupFormHandler() {
        const reviewForm = document.getElementById('reviewForm');
        const successMessage = document.getElementById('successMessage');
        
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Validate form
                const formData = new FormData(reviewForm);
                const reviewData = {
                    fullName: formData.get('fullName').trim(),
                    email: formData.get('email').trim(),
                    relationship: formData.get('relationship').trim(),
                    review: formData.get('review').trim()
                };

                // Basic validation
                if (reviewData.review.length < 10) {
                    alert('Review must be at least 10 characters long.');
                    return;
                }

                // Add the review
                this.addReview(reviewData);

                // Show success message
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                    }, 3000);
                }

                // Reset form
                reviewForm.reset();

                console.log('Review added successfully:', reviewData);
            });
        }
    }

    // Setup carousel functionality (for index.html)
    setupCarousel() {
        const prevButton = document.getElementById('prevBtn');
        const nextButton = document.getElementById('nextBtn');
        const carousel = document.getElementById('reviewCarousel');

        if (prevButton && nextButton && carousel) {
            prevButton.addEventListener('click', () => {
                this.previousReview();
            });

            nextButton.addEventListener('click', () => {
                this.nextReview();
            });

            // Auto-advance carousel every 5 seconds
            setInterval(() => {
                this.nextReview();
            }, 5000);
        }
    }

    // Display reviews in carousel
    displayReviews() {
        const carousel = document.getElementById('reviewCarousel');
        if (!carousel || this.reviews.length === 0) return;

        carousel.innerHTML = '';

        this.reviews.forEach((review, index) => {
            const reviewElement = document.createElement('div');
            reviewElement.className = `carousel-item ${index === this.currentIndex ? 'active' : ''}`;
            reviewElement.innerHTML = `
                <div class="review-card">
                    <div class="review-content">
                        <p class="review-text">"${this.escapeHtml(review.review)}"</p>
                        <div class="review-author">
                            <p class="author-name">${this.escapeHtml(review.fullName)}</p>
                            <p class="author-relationship">${this.escapeHtml(review.relationship)}</p>
                        </div>
                    </div>
                </div>
            `;
            carousel.appendChild(reviewElement);
        });

        this.updateCarouselDisplay();
    }

    // Navigate to previous review
    previousReview() {
        if (this.reviews.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.reviews.length) % this.reviews.length;
        this.updateCarouselDisplay();
    }

    // Navigate to next review
    nextReview() {
        if (this.reviews.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.reviews.length;
        this.updateCarouselDisplay();
    }

    // Update carousel display
    updateCarouselDisplay() {
        const carousel = document.getElementById('reviewCarousel');
        if (!carousel) return;

        const items = carousel.querySelectorAll('.carousel-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });

        // Update button states
        const prevButton = document.getElementById('prevBtn');
        const nextButton = document.getElementById('nextBtn');
        
        if (prevButton && nextButton) {
            prevButton.disabled = this.reviews.length <= 1;
            nextButton.disabled = this.reviews.length <= 1;
        }
    }

    // Utility function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Get all reviews (for debugging or external use)
    getAllReviews() {
        return this.reviews;
    }

    // Clear all reviews (for testing)
    clearAllReviews() {
        this.reviews = [];
        this.saveReviews();
        this.displayReviews();
    }

    // Reset to default reviews
    resetToDefaults() {
        this.reviews = [...this.defaultReviews];
        this.saveReviews();
        this.displayReviews();
    }
}

// Initialize the reviews system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.reviewsManager = new ReviewsManager();
    
    // Add some debugging functions to window for testing
    window.debugReviews = {
        getAll: () => window.reviewsManager.getAllReviews(),
        clear: () => window.reviewsManager.clearAllReviews(),
        reset: () => window.reviewsManager.resetToDefaults()
    };
    
    console.log('Reviews system initialized successfully');
});