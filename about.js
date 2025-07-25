
        // Scroll-based animations using IntersectionObserver
        const animateElements = document.querySelectorAll('.animate-in');
        const missionCards = document.querySelectorAll('.mission-card');
        const teamCards = document.querySelectorAll('.team-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('mission-card') || entry.target.classList.contains('team-card')) {
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

        teamCards.forEach(card => {
            observer.observe(card);
        });

        // Team and achievement card interactions
        document.querySelectorAll('.team-card, .achievement-card').forEach(card => {
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

        // Team card hover animation
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        function toggleMenu() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('active');
        }