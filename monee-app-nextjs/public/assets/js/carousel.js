document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initCarousel, 100);

  function initCarousel() {
    const carousel = document.getElementById('reviewsCarousel');
    const navDots = document.querySelector('.reviewsNavDots');
    const prevBtn = document.querySelector('.reviewsNavPrev');
    const nextBtn = document.querySelector('.reviewsNavNext');
    
    if (!carousel || !navDots || !prevBtn || !nextBtn) return;
    
    const cards = Array.from(carousel.querySelectorAll('.reviewCard'));
    if (cards.length === 0) return;
    
    // Determine visible cards based on screen width
    const getVisibleCards = () => 
      window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
    
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
    
    // Go to specific slide
    function goToSlide(index) {
      currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
      
      const cardWidth = cards[0].offsetWidth;
      const gapSize = 30; // match CSS gap
      carousel.style.transform = `translateX(-${currentSlide * visibleCards * (cardWidth + gapSize)}px)`;
      
      // Update active dot
      document.querySelectorAll('.reviewsNavDot').forEach((dot, i) => 
        dot.classList.toggle('active', i === currentSlide)
      );
      
      // Update button states
      prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
      nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => currentSlide > 0 && goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => currentSlide < totalSlides - 1 && goToSlide(currentSlide + 1));
    
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