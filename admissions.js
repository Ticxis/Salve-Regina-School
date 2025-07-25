function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}
    
function showStep(stepNumber, element) {
    // Only run for non-mobile viewports
    if (window.innerWidth >= 768) {
        // Reset all circles and content
        document.querySelectorAll('.step-circle').forEach(circle => {
            circle.classList.remove('active');
            circle.style.backgroundColor = '#e5e7eb';
            circle.style.color = '#2563eb';
            circle.style.borderColor = '#2563eb';
        });
        document.querySelectorAll('.process-box .step-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById('process-box').classList.remove('active');

        // Activate selected circle and content
        element.classList.add('active');
        element.style.backgroundColor = '#2563eb';
        element.style.color = 'white';
        element.style.borderColor = '#facc15';
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        document.getElementById('process-box').classList.add('active');
    }
}

// Initialize first step for non-mobile viewports
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth >= 768) {
        const firstCircle = document.querySelector('.step-circle.active');
        if (firstCircle) {
            showStep(1, firstCircle);
        }
    }
});

// Update on resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        const activeCircle = document.querySelector('.step-circle.active');
        if (activeCircle) {
            const stepNumber = activeCircle.getAttribute('onclick').match(/\d+/)[0];
            showStep(stepNumber, activeCircle);
        }
    } else {
        document.querySelectorAll('.process-box .step-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById('process-box').classList.remove('active');
    }
});
       
       // Scroll-based animations using IntersectionObserver
        const animateElements = document.querySelectorAll('.animate-in');
        const programCards = document.querySelectorAll('.program-card');
        const facultyCards = document.querySelectorAll('.faculty-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('program-card') || entry.target.classList.contains('faculty-card')) {
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

        programCards.forEach(card => {
            observer.observe(card);
        });

        facultyCards.forEach(card => {
            observer.observe(card);
        });


