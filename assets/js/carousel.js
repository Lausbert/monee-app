document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for all assets to load
    setTimeout(function() {
        initCarousel();
    }, 100);

    function initCarousel() {
        const carousel = document.getElementById('reviewsCarousel');
        const navDots = document.querySelector('.reviewsNavDots');
        const prevBtn = document.querySelector('.reviewsNavPrev');
        const nextBtn = document.querySelector('.reviewsNavNext');
        
        if (!carousel || !navDots || !prevBtn || !nextBtn) return;
        
        const cards = Array.from(carousel.querySelectorAll('.reviewCard'));
        if (cards.length === 0) return;
        
        // Determine how many cards to show at once based on screen width
        function getVisibleCards() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }
        
        // Set up initial state
        let currentSlide = 0;
        let visibleCards = getVisibleCards();
        let totalSlides = Math.ceil(cards.length / visibleCards);
        
        // Create navigation dots
        function createDots() {
            navDots.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('reviewsNavDot');
                if (i === currentSlide) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                navDots.appendChild(dot);
            }
        }
        
        // Go to a specific slide
        function goToSlide(index) {
            currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
            
            // Calculate the position to scroll to
            const cardWidth = cards[0].offsetWidth;
            const gapSize = 30; // match the CSS gap value
            const offset = currentSlide * visibleCards * (cardWidth + gapSize);
            
            // Apply the transform
            carousel.style.transform = `translateX(-${offset}px)`;
            
            // Update active dot
            const dots = navDots.querySelectorAll('.reviewsNavDot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
            
            // Update button states
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === totalSlides - 1;
            prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
        }
        
        // Set up event listeners
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) goToSlide(currentSlide - 1);
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const newVisibleCards = getVisibleCards();
            if (newVisibleCards !== visibleCards) {
                visibleCards = newVisibleCards;
                totalSlides = Math.ceil(cards.length / visibleCards);
                currentSlide = Math.min(currentSlide, totalSlides - 1);
                createDots();
                goToSlide(currentSlide);
            }
        });
        
        // Initialize
        createDots();
        goToSlide(0);
    }
});