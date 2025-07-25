/**
 * Unified Reviews System
 * Handles review submission, storage, and management using localStorage
 */

class ReviewManager {
    constructor() {
        this.storageKey = 'school_reviews';
        this.nextIdKey = 'next_review_id';
        this.reviews = this.loadReviews();
        this.nextId = this.getNextId();
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Add real-time validation
        const textarea = document.getElementById('review');
        if (textarea) {
            textarea.addEventListener('input', (e) => this.validateTextarea(e));
        }
    }

    // Load reviews from localStorage
    loadReviews() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading reviews:', error);
            return [];
        }
    }

    // Get next available ID
    getNextId() {
        try {
            const stored = localStorage.getItem(this.nextIdKey);
            return stored ? parseInt(stored) : 1;
        } catch (error) {
            return 1;
        }
    }

    // Save reviews to localStorage
    saveReviews() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.reviews));
            localStorage.setItem(this.nextIdKey, this.nextId.toString());
            return true;
        } catch (error) {
            console.error('Error saving reviews:', error);
            this.showMessage('Error saving review. Please try again.', 'error');
            return false;
        }
    }

    // Handle form submission
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const reviewData = {
            id: this.nextId++,
            fullName: formData.get('fullName').trim(),
            email: formData.get('email').trim(),
            relationship: formData.get('relationship').trim(),
            review: formData.get('review').trim(),
            timestamp: new Date().toISOString(),
            status: 'pending' // pending, approved, rejected
        };

        // Validate data
        if (!this.validateReview(reviewData)) {
            return;
        }

        // Add review
        this.reviews.push(reviewData);
        
        // Save to localStorage
        if (this.saveReviews()) {
            this.showSuccessMessage();
            this.resetForm();
            
            // Log for debugging
            console.log('Review submitted:', reviewData);
            console.log('Total reviews:', this.reviews.length);
        }
    }

    // Validate review data
    validateReview(data) {
        const errors = [];

        if (!data.fullName || data.fullName.length < 2) {
            errors.push('Full name must be at least 2 characters long');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.relationship || data.relationship.length < 3) {
            errors.push('Please specify your relationship to the student');
        }

        if (!data.review || data.review.length < 10) {
            errors.push('Review must be at least 10 characters long');
        }

        if (errors.length > 0) {
            this.showMessage(errors.join('<br>'), 'error');
            return false;
        }

        return true;
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time textarea validation
    validateTextarea(e) {
        const textarea = e.target;
        const value = textarea.value.trim();
        const minLength = 10;
        
        // Remove existing validation message
        const existingMsg = textarea.parentNode.querySelector('.validation-message');
        if (existingMsg) {
            existingMsg.remove();
        }

        if (value.length > 0 && value.length < minLength) {
            const message = document.createElement('p');
            message.className = 'validation-message text-sm text-red-500 mt-1';
            message.textContent = `${minLength - value.length} more characters required`;
            textarea.parentNode.appendChild(message);
        }
    }

    // Show success message
    showSuccessMessage() {
        const successElement = document.getElementById('successMessage');
        if (successElement) {
            successElement.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                successElement.classList.add('hidden');
            }, 5000);
        }
    }

    // Show error/info messages
    showMessage(message, type = 'info') {
        // Create or update message element
        let messageElement = document.getElementById('dynamicMessage');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'dynamicMessage';
            messageElement.className = 'mt-6 p-4 rounded-lg text-center font-semibold';
            
            const form = document.getElementById('reviewForm');
            if (form) {
                form.parentNode.insertBefore(messageElement, form.nextSibling);
            }
        }

        // Set styling based on type
        messageElement.classList.remove('hidden');
        if (type === 'error') {
            messageElement.className = 'mt-6 p-4 rounded-lg text-center font-semibold bg-red-100 text-red-800 border border-red-200';
        } else if (type === 'success') {
            messageElement.className = 'mt-6 p-4 rounded-lg text-center font-semibold bg-green-100 text-green-800 border border-green-200';
        } else {
            messageElement.className = 'mt-6 p-4 rounded-lg text-center font-semibold bg-blue-100 text-blue-800 border border-blue-200';
        }

        messageElement.innerHTML = message;

        // Auto-hide after 7 seconds
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 7000);
    }

    // Reset form
    resetForm() {
        const form = document.getElementById('reviewForm');
        if (form) {
            form.reset();
            
            // Remove validation messages
            const validationMessages = form.querySelectorAll('.validation-message');
            validationMessages.forEach(msg => msg.remove());
        }
    }

    // Get all reviews
    getAllReviews() {
        return this.reviews;
    }

    // Get reviews by status
    getReviewsByStatus(status) {
        return this.reviews.filter(review => review.status === status);
    }

    // Update review status (for admin functions)
    updateReviewStatus(reviewId, status) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.status = status;
            review.lastUpdated = new Date().toISOString();
            return this.saveReviews();
        }
        return false;
    }

    // Delete review (for admin functions)
    deleteReview(reviewId) {
        const index = this.reviews.findIndex(r => r.id === reviewId);
        if (index !== -1) {
            this.reviews.splice(index, 1);
            return this.saveReviews();
        }
        return false;
    }

    // Export reviews as JSON
    exportReviews() {
        const dataStr = JSON.stringify(this.reviews, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `school-reviews-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Import reviews from JSON file
    importReviews(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importedReviews = JSON.parse(e.target.result);
                    
                    // Validate imported data
                    if (!Array.isArray(importedReviews)) {
                        throw new Error('Invalid file format');
                    }

                    // Merge with existing reviews (avoid duplicates by email + timestamp)
                    const existingKeys = new Set(
                        this.reviews.map(r => `${r.email}-${r.timestamp}`)
                    );

                    let addedCount = 0;
                    importedReviews.forEach(review => {
                        const key = `${review.email}-${review.timestamp}`;
                        if (!existingKeys.has(key)) {
                            // Assign new ID to avoid conflicts
                            review.id = this.nextId++;
                            this.reviews.push(review);
                            addedCount++;
                        }
                    });

                    if (this.saveReviews()) {
                        resolve({ success: true, addedCount });
                    } else {
                        reject(new Error('Failed to save imported reviews'));
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Get statistics
    getStats() {
        const total = this.reviews.length;
        const pending = this.reviews.filter(r => r.status === 'pending').length;
        const approved = this.reviews.filter(r => r.status === 'approved').length;
        const rejected = this.reviews.filter(r => r.status === 'rejected').length;
        
        // Get date range
        const dates = this.reviews.map(r => new Date(r.timestamp));
        const oldest = dates.length > 0 ? new Date(Math.min(...dates)) : null;
        const newest = dates.length > 0 ? new Date(Math.max(...dates)) : null;

        return {
            total,
            pending,
            approved,
            rejected,
            oldest: oldest ? oldest.toLocaleDateString() : null,
            newest: newest ? newest.toLocaleDateString() : null
        };
    }

    // Clear all reviews (for testing/admin)
    clearAllReviews() {
        if (confirm('Are you sure you want to delete all reviews? This cannot be undone.')) {
            this.reviews = [];
            this.nextId = 1;
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.nextIdKey);
            this.showMessage('All reviews have been cleared.', 'success');
            return true;
        }
        return false;
    }
}

// Initialize the review manager
const reviewManager = new ReviewManager();

// Expose to global scope for debugging/admin functions
window.ReviewManager = reviewManager;

// Console helper for development
console.log('Review Manager initialized. Available methods:');
console.log('- ReviewManager.getAllReviews() - Get all reviews');
console.log('- ReviewManager.getStats() - Get statistics');
console.log('- ReviewManager.exportReviews() - Export reviews to JSON');
console.log('- ReviewManager.clearAllReviews() - Clear all reviews (with confirmation)');