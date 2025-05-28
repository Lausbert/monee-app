import { useState, useEffect, useRef } from 'react';
import useTranslations from '@/hooks/useTranslations';

const Reviews = () => {
  const { t, translations } = useTranslations();
  // Access the reviews array directly from translations object
  const reviews = translations?.global?.reviews || []; // Expecting an array of review objects

  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [totalSlides, setTotalSlides] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const gapSize = 30; // Corresponds to CSS gap

  useEffect(() => {
    const calculateVisibleCards = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    };    const updateCarouselState = () => {
      const newVisibleCards = calculateVisibleCards();
      setVisibleCards(newVisibleCards);
      
      // Use fixed card widths that match CSS instead of measuring DOM
      let fixedCardWidth;
      if (window.innerWidth <= 768) {
        fixedCardWidth = 280; // Mobile card width
      } else if (window.innerWidth <= 992) {
        fixedCardWidth = 300; // Tablet card width
      } else {
        fixedCardWidth = 350; // Desktop card width
      }
      
      setCardWidth(fixedCardWidth);      if (reviews.length > 0) {
        // Calculate total pages: each page shows a full set of visibleCards
        // For 6 reviews with 3 visible: 2 pages (0-2, 3-5)
        setTotalSlides(Math.ceil(reviews.length / newVisibleCards));
      }
    };

    // Add a small delay to ensure DOM is rendered
    const timeoutId = setTimeout(updateCarouselState, 100);
    window.addEventListener('resize', updateCarouselState);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateCarouselState);
    };
  }, [reviews.length]);  useEffect(() => {
    if (reviews.length > 0) {
        // Calculate total pages: each page shows a full set of visibleCards
        // For 6 reviews with 3 visible: 2 pages (0-2, 3-5)
        setTotalSlides(Math.ceil(reviews.length / visibleCards));
    }
  }, [visibleCards, reviews.length]);

  useEffect(() => {
    setCurrentSlide(prev => Math.min(prev, totalSlides > 0 ? totalSlides - 1 : 0));
  }, [totalSlides]);


  const goToSlide = (index) => {
    const newSlide = Math.max(0, Math.min(index, totalSlides - 1));
    setCurrentSlide(newSlide);
  };  if (!reviews || reviews.length === 0) {
    return <p>{t('reviews.no_reviews') || 'No reviews available at the moment.'}</p>;
  }  const carouselStyle = {
    transform: `translateX(-${currentSlide * visibleCards * (cardWidth + gapSize)}px)`,
    display: 'flex',
    gap: `${gapSize}px`,
    transition: 'transform 0.5s ease-in-out',
    width: 'fit-content',
  };
  
  return (
    <div className="reviews">
      <div className="reviewsGridContainer">
        <div className="reviewsGrid" ref={carouselRef} style={carouselStyle}>
          {reviews.map((review, index) => (
            <div 
              className="reviewCard" 
              key={index}
            >
              <div className="reviewTitle">
                <h4>{review.title}</h4>
              </div>
              <div className="reviewStars">{review.stars || '⭐️⭐️⭐️⭐️⭐️'}</div>
              <p className="reviewBody">{review.body}</p>
              <p className="reviewAuthor">- {review.reviewerNickname}</p>
            </div>
          ))}
        </div>
      </div>
      {totalSlides > 1 && (
        <div className="reviewsNav">
          <button 
            className="reviewsNavPrev" 
            aria-label={t('reviews.previous') || "Previous"} 
            onClick={() => goToSlide(currentSlide - 1)} 
            disabled={currentSlide === 0}
            style={{ opacity: currentSlide === 0 ? '0.5' : '1' }}
          >
            &lsaquo;
          </button>
          <div className="reviewsNavDots">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div 
                key={i} 
                className={`reviewsNavDot ${i === currentSlide ? 'active' : ''}`} 
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
          <button 
            className="reviewsNavNext" 
            aria-label={t('reviews.next') || "Next"} 
            onClick={() => goToSlide(currentSlide + 1)} 
            disabled={currentSlide === totalSlides - 1}
            style={{ opacity: currentSlide === totalSlides - 1 ? '0.5' : '1' }}
          >
            &rsaquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
