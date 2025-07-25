window.ReviewManager = {
    // Storage keys
    PENDING_KEY: 'srs_pending_reviews',
    APPROVED_KEY: 'srs_approved_reviews',
    
    // Initialize the review system
    init() {
        this.loadApprovedReviews();
        this.setupApprovalListener();
        console.log('Review Manager initialized');
    },

    // Store pending review (waiting for admin approval)
    storePendingReview(reviewData) {
        try {
            const pendingReviews = this.getPendingReviews();
            pendingReviews.push({
                ...reviewData,
                submittedAt: new Date().toISOString(),
                status: 'pending'
            });
            
            localStorage.setItem(this.PENDING_KEY, JSON.stringify(pendingReviews));
            console.log('Pending review stored:', reviewData.id);
            return true;
        } catch (error) {
            console.error('Error storing pending review:', error);
            return false;
        }
    },

    // Get all pending reviews
    getPendingReviews() {
        try {
            const stored = localStorage.getItem(this.PENDING_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading pending reviews:', error);
            return [];
        }
    },

    // Get all approved reviews
    getApprovedReviews() {
        try {
            const stored = localStorage.getItem(this.APPROVED_KEY);
            return stored ? JSON.parse(stored) : this.getDefaultReviews();
        } catch (error) {
            console.error('Error loading approved reviews:', error);
            return this.getDefaultReviews();
        }
    },

    // Default sample reviews for testing
    getDefaultReviews() {
        return [
            {
                id: 'review_default_1',
                fullName: 'Mary Asante',
                email: 'mary.asante@example.com',
                relationship: 'Parent of 4th Grader',
                review: 'Salve Regina School has exceeded our expectations. The teachers are caring and dedicated, and my daughter loves going to school every day.',
                timestamp: new Date('2024-11-15').toISOString(),
                status: 'approved',
                approvedAt: new Date('2024-11-16').toISOString()
            },
            {
                id: 'review_default_2',
                fullName: 'Dr. Kwame Boateng',
                email: 'k.boateng@example.com',
                relationship: 'Parent of 7th Grader',
                review: 'The academic standards at SRS are impressive. My son has shown remarkable improvement in his studies and confidence.',
                timestamp: new Date('2024-11-20').toISOString(),
                status: 'approved',
                approvedAt: new Date('2024-11-21').toISOString()
            },
            {
                id: 'review_default_3',
                fullName: 'Grace Mensah',
                email: 'grace.mensah@example.com',
                relationship: 'Parent of 2nd Grader',
                review: 'The school facilities are excellent and the staff truly cares about each child\'s development. Highly recommended!',
                timestamp: new Date('2024-11-25').toISOString(),
                status: 'approved',
                approvedAt: new Date('2024-11-26').toISOString()
            }
        ];
    },

    // Load approved reviews and update display
    loadApprovedReviews() {
        const approvedReviews = this.getApprovedReviews();
        
        // Update the global ReviewsDB if it exists
        if (window.ReviewsDB) {
            window.ReviewsDB.reviews = approvedReviews;
            window.ReviewsDB.notifyObservers && window.ReviewsDB.notifyObservers();
        }
        
        return approvedReviews;
    },

    // Approve a review (simulate admin approval)
    approveReview(reviewId) {
        try {
            const pendingReviews = this.getPendingReviews();
            const approvedReviews = this.getApprovedReviews();
            
            const reviewIndex = pendingReviews.findIndex(review => review.id === reviewId);
            if (reviewIndex === -1) {
                console.warn('Review not found in pending:', reviewId);
                return false;
            }

            // Move from pending to approved
            const review = pendingReviews[reviewIndex];
            review.status = 'approved';
            review.approvedAt = new Date().toISOString();
            
            approvedReviews.push(review);
            pendingReviews.splice(reviewIndex, 1);

            // Save updated arrays
            localStorage.setItem(this.APPROVED_KEY, JSON.stringify(approvedReviews));
            localStorage.setItem(this.PENDING_KEY, JSON.stringify(pendingReviews));
            
            // Update display
            this.loadApprovedReviews();
            
            console.log('Review approved:', reviewId);
            return true;
        } catch (error) {
            console.error('Error approving review:', error);
            return false;
        }
    },

    // Reject a review (remove from pending)
    rejectReview(reviewId) {
        try {
            const pendingReviews = this.getPendingReviews();
            const reviewIndex = pendingReviews.findIndex(review => review.id === reviewId);
            
            if (reviewIndex === -1) {
                console.warn('Review not found in pending:', reviewId);
                return false;
            }

            // Remove from pending
            pendingReviews.splice(reviewIndex, 1);
            localStorage.setItem(this.PENDING_KEY, JSON.stringify(pendingReviews));
            
            console.log('Review rejected:', reviewId);
            return true;
        } catch (error) {
            console.error('Error rejecting review:', error);
            return false;
        }
    },

    // Setup listener for admin approval commands
    // This simulates the email approval process
    setupApprovalListener() {
        // Add to window for easy testing in console
        window.adminApproveReview = (reviewId) => {
            return this.approveReview(reviewId);
        };
        
        window.adminRejectReview = (reviewId) => {
            return this.rejectReview(reviewId);
        };
        
        // For testing: auto-approve after 30 seconds (remove in production)
        if (window.location.search.includes('test=true')) {
            console.log('Test mode: Reviews will auto-approve after 30 seconds');
            setInterval(() => {
                const pending = this.getPendingReviews();
                if (pending.length > 0) {
                    const oldestReview = pending[0];
                    const submittedTime = new Date(oldestReview.submittedAt);
                    const now = new Date();
                    const timeDiff = now - submittedTime;
                    
                    // Auto-approve if older than 30 seconds
                    if (timeDiff > 30000) {
                        console.log('Auto-approving test review:', oldestReview.id);
                        this.approveReview(oldestReview.id);
                    }
                }
            }, 5000);
        }
    },

    // Get review statistics
    getStats() {
        const pending = this.getPendingReviews();
        const approved = this.getApprovedReviews();
        
        return {
            pendingCount: pending.length,
            approvedCount: approved.length,
            totalCount: pending.length + approved.length,
            pendingReviews: pending,
            approvedReviews: approved
        };
    },

    // Export reviews as JSON
    exportReviews() {
        const stats = this.getStats();
        const exportData = {
            exportDate: new Date().toISOString(),
            statistics: {
                pending: stats.pendingCount,
                approved: stats.approvedCount,
                total: stats.totalCount
            },
            pendingReviews: stats.pendingReviews,
            approvedReviews: stats.approvedReviews
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `srs_reviews_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('Reviews exported successfully');
    },

    // Clear all data (for testing)
    clearAllData() {
        if (confirm('Are you sure you want to clear all review data? This cannot be undone.')) {
            localStorage.removeItem(this.PENDING_KEY);
            localStorage.removeItem(this.APPROVED_KEY);
            this.loadApprovedReviews();
            console.log('All review data cleared');
            return true;
        }
        return false;
    }
};

// Integration with existing ReviewsDB system
if (window.ReviewsDB) {
    // Enhance existing ReviewsDB with email workflow
    const originalCreate = window.ReviewsDB.create;
    
    window.ReviewsDB.create = function(reviewData) {
        // Don't add directly to reviews, store as pending instead
        return window.ReviewManager.storePendingReview({
            ...reviewData,
            id: this.getNextId ? this.getNextId() : Date.now(),
            timestamp: new Date().toISOString()
        });
    };

    // Update getNextId to work with both pending and approved
    window.ReviewsDB.getNextId = function() {
        const approved = window.ReviewManager.getApprovedReviews();
        const pending = window.ReviewManager.getPendingReviews();
        const allReviews = [...approved, ...pending];
        return allReviews.length > 0 ? Math.max(...allReviews.map(r => r.id || 0)) + 1 : 1;
    };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ReviewManager.init();
    });
} else {
    window.ReviewManager.init();
}

// Console commands for admin testing
console.log(`
Review Manager Commands:
- ReviewManager.getStats() - View review statistics  
- adminApproveReview('review_id') - Approve a pending review
- adminRejectReview('review_id') - Reject a pending review
- ReviewManager.exportReviews() - Download reviews as JSON
- ReviewManager.clearAllData() - Clear all review data

For auto-testing, add ?test=true to the URL
`);