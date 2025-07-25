// Enhanced Review Management System
// File: /website-root/reviews.js (note the plural filename)

window.ReviewManager = {
    // Storage keys
    PENDING_KEY: 'srs_pending_reviews',
    APPROVED_KEY: 'srs_approved_reviews',
    
    // Initialize the review system
    init() {
        this.loadApprovedReviews();
        this.setupApprovalListener();
        console.log('Review Manager initialized successfully');
    },

    // Store pending review (waiting for admin approval)
    storePendingReview(reviewData) {
        try {
            const pendingReviews = this.getPendingReviews();
            const newReview = {
                ...reviewData,
                submittedAt: new Date().toISOString(),
                status: 'pending'
            };
            
            pendingReviews.push(newReview);
            localStorage.setItem(this.PENDING_KEY, JSON.stringify(pendingReviews));
            
            console.log('✅ Pending review stored successfully:', reviewData.id);
            return true;
        } catch (error) {
            console.error('❌ Error storing pending review:', error);
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
                review: 'Salve Regina School has exceeded our expectations. The teachers are caring and dedicated, and my daughter loves going to school every day. The facilities are excellent and the environment is very nurturing.',
                timestamp: new Date('2024-12-15').toISOString(),
                status: 'approved',
                approvedAt: new Date('2024-12-16').toISOString()
            },
            {
                id: 'review_default_2',
                fullName: 'Dr. Kwame Boateng',
                email: 'k.boateng@example.com',
                relationship: 'Parent of 7th Grader',
                review: 'The academic standards at SRS are impressive. My son has shown remarkable improvement in his studies and confidence. The STEM program is particularly outstanding.',
                timestamp: new Date('2024-12-20').toISOString(),
                status: 'approved',
                approvedAt: new Date('2024-12-21').toISOString()
            },
            {
                id: 'review_default_3',
                fullName: 'Grace Mensah',
                email: 'grace.mensah@example.com',
                relationship: 'Parent of 2nd Grader',
                review: 'The school facilities are excellent and the staff truly cares about each child\'s development. The communication with parents is outstanding. Highly recommended!',
                timestamp: new Date('2024-12-25').toISOString(),
                status: 'approved',
                approvedAt: new Date('2024-12-26').toISOString()
            }
        ];
    },

    // Load approved reviews and update display
    loadApprovedReviews() {
        const approvedReviews = this.getApprovedReviews();
        
        // Update the global ReviewsDB if it exists
        if (window.ReviewsDB) {
            window.ReviewsDB.reviews = approvedReviews;
            if (window.ReviewsDB.notifyObservers) {
                window.ReviewsDB.notifyObservers();
            }
        }
        
        console.log('✅ Loaded', approvedReviews.length, 'approved reviews');
        return approvedReviews;
    },

    // Approve a review (simulate admin approval)
    approveReview(reviewId) {
        try {
            console.log('🔄 Attempting to approve review:', reviewId);
            
            const pendingReviews = this.getPendingReviews();
            const approvedReviews = this.getApprovedReviews();
            
            const reviewIndex = pendingReviews.findIndex(review => review.id === reviewId);
            if (reviewIndex === -1) {
                console.warn('⚠️ Review not found in pending:', reviewId);
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
            
            console.log('✅ Review approved successfully:', reviewId);
            return true;
        } catch (error) {
            console.error('❌ Error approving review:', error);
            return false;
        }
    },

    // Reject a review (remove from pending)
    rejectReview(reviewId) {
        try {
            console.log('🔄 Attempting to reject review:', reviewId);
            
            const pendingReviews = this.getPendingReviews();
            const reviewIndex = pendingReviews.findIndex(review => review.id === reviewId);
            
            if (reviewIndex === -1) {
                console.warn('⚠️ Review not found in pending:', reviewId);
                return false;
            }

            // Remove from pending
            const rejectedReview = pendingReviews[reviewIndex];
            pendingReviews.splice(reviewIndex, 1);
            localStorage.setItem(this.PENDING_KEY, JSON.stringify(pendingReviews));
            
            console.log('✅ Review rejected successfully:', reviewId);
            console.log('Rejected review details:', rejectedReview);
            return true;
        } catch (error) {
            console.error('❌ Error rejecting review:', error);
            return false;
        }
    },

    // Setup listener for admin approval commands
    setupApprovalListener() {
        // Add global functions for easy testing in console
        window.adminApproveReview = (reviewId) => {
            return this.approveReview(reviewId);
        };
        
        window.adminRejectReview = (reviewId) => {
            return this.rejectReview(reviewId);
        };
        
        // For testing: auto-approve after 30 seconds (remove in production)
        if (window.location.search.includes('test=true')) {
            console.log('🧪 TEST MODE: Reviews will auto-approve after 30 seconds');
            setInterval(() => {
                const pending = this.getPendingReviews();
                if (pending.length > 0) {
                    const oldestReview = pending[0];
                    const submittedTime = new Date(oldestReview.submittedAt);
                    const now = new Date();
                    const timeDiff = now - submittedTime;
                    
                    // Auto-approve if older than 30 seconds
                    if (timeDiff > 30000) {
                        console.log('🧪 Auto-approving test review:', oldestReview.id);
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
            pendingReviews: pending.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)), // Newest first
            approvedReviews: approved.sort((a, b) => new Date(b.approvedAt || b.timestamp) - new Date(a.approvedAt || a.timestamp)) // Newest first
        };
    },

    // Export reviews as JSON
    exportReviews() {
        try {
            const stats = this.getStats();
            const exportData = {
                exportDate: new Date().toISOString(),
                exportedBy: 'Salve Regina School Admin',
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
            
            console.log('✅ Reviews exported successfully');
            return true;
        } catch (error) {
            console.error('❌ Error exporting reviews:', error);
            return false;
        }
    },

    // Import reviews from JSON (for backup restoration)
    importReviews(fileContent) {
        try {
            const importData = JSON.parse(fileContent);
            
            if (importData.approvedReviews) {
                localStorage.setItem(this.APPROVED_KEY, JSON.stringify(importData.approvedReviews));
            }
            
            if (importData.pendingReviews) {
                localStorage.setItem(this.PENDING_KEY, JSON.stringify(importData.pendingReviews));
            }
            
            this.loadApprovedReviews();
            console.log('✅ Reviews imported successfully');
            return true;
        } catch (error) {
            console.error('❌ Error importing reviews:', error);
            return false;
        }
    },

    // Clear all data (for testing)
    clearAllData() {
        if (confirm('⚠️ Are you sure you want to clear ALL review data? This cannot be undone.')) {
            localStorage.removeItem(this.PENDING_KEY);
            localStorage.removeItem(this.APPROVED_KEY);
            this.loadApprovedReviews();
            console.log('🗑️ All review data cleared');
            return true;
        }
        return false;
    },

    // Get review by ID (helper function)
    getReviewById(reviewId) {
        const pending = this.getPendingReviews();
        const approved = this.getApprovedReviews();
        
        return pending.find(r => r.id === reviewId) || approved.find(r => r.id === reviewId) || null;
    },

    // Check if localStorage is available
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.error('❌ localStorage not available:', error);
            return false;
        }
    }
};

// Integration with existing ReviewsDB system
if (window.ReviewsDB) {
    // Enhance existing ReviewsDB with email workflow
    const originalCreate = window.ReviewsDB.create;
    
    window.ReviewsDB.create = function(reviewData) {
        // Don't add directly to reviews, store as pending instead
        if (window.ReviewManager) {
            return window.ReviewManager.storePendingReview({
                ...reviewData,
                id: this.getNextId ? this.getNextId() : 'review_' + Date.now(),
                timestamp: new Date().toISOString()
            });
        } else {
            // Fallback to original behavior
            return originalCreate.call(this, reviewData);
        }
    };

    // Update getNextId to work with both pending and approved
    window.ReviewsDB.getNextId = function() {
        if (window.ReviewManager) {
            const approved = window.ReviewManager.getApprovedReviews();
            const pending = window.ReviewManager.getPendingReviews();
            const allReviews = [...approved, ...pending];
            
            if (allReviews.length === 0) return 1;
            
            const numericIds = allReviews
                .map(r => {
                    if (typeof r.id === 'string') {
                        // Extract numbers from string IDs like "review_123456_abc"
                        const match = r.id.match(/\d+/);
                        return match ? parseInt(match[0]) : 0;
                    }
                    return typeof r.id === 'number' ? r.id : 0;
                })
                .filter(id => !isNaN(id) && id > 0);
                
            return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
        } else {
            return this.reviews.length > 0 ? Math.max(...this.reviews.map(r => r.id || 0)) + 1 : 1;
        }
    };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Check if localStorage is available
        if (!window.ReviewManager.isStorageAvailable()) {
            console.warn('⚠️ localStorage not available - reviews will not persist');
        }
        
        window.ReviewManager.init();
    });
} else {
    window.ReviewManager.init();
}

// Console commands for admin testing
console.log(`
📋 Review Manager Commands Available:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• ReviewManager.getStats() - View review statistics  
• adminApproveReview('review_id') - Approve a pending review
• adminRejectReview('review_id') - Reject a pending review
• ReviewManager.exportReviews() - Download reviews as JSON
• ReviewManager.clearAllData() - Clear all review data (with confirmation)
• ReviewManager.getReviewById('review_id') - Find specific review

🧪 For testing: Add ?test=true to form URL for auto-approval
📊 Storage: ${window.ReviewManager.isStorageAvailable() ? '✅ Available' : '❌ Not Available'}
`);

// Make ReviewManager globally available
window.ReviewsManager = window.ReviewManager; // Alias for backwards compatibility