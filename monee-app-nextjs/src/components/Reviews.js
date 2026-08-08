import { useEffect, useMemo, useRef, useState } from 'react';
import useTranslations from '@/hooks/useTranslations';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 992;

const Reviews = ({ translations: translationsProp, reviews: reviewsProp } = {}) => {
  const { t, translations: translationData } = useTranslations(
    translationsProp && !Array.isArray(translationsProp) ? translationsProp : undefined
  );

  const reviews = useMemo(() => {
    if (Array.isArray(reviewsProp)) return reviewsProp;
    if (Array.isArray(translationsProp)) return translationsProp;
    const source = translationData || translationsProp || {};
    const fromGlobal = source?.global?.reviews;
    if (Array.isArray(fromGlobal)) return fromGlobal;
    if (Array.isArray(source?.reviews)) return source.reviews;
    return [];
  }, [reviewsProp, translationsProp, translationData]);

  const scrollContainerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [cardWidth, setCardWidth] = useState(350);
  const gapSize = 30; // Matches CSS gap

  const totalSlides = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    return Math.ceil(reviews.length / visibleCards);
  }, [reviews, visibleCards]);

  const activeSlide = Math.min(currentSlide, Math.max(totalSlides - 1, 0));
  const isMobile = visibleCards === 1;

  useEffect(() => {
    const updateSizing = () => {
      if (typeof window === 'undefined') return;

      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        setVisibleCards(1);
        setCardWidth(280);
        return;
      }

      if (window.innerWidth <= TABLET_BREAKPOINT) {
        setVisibleCards(2);
        setCardWidth(300);
        return;
      }

      setVisibleCards(3);
      setCardWidth(350);
    };

    updateSizing();
    window.addEventListener('resize', updateSizing);
    return () => window.removeEventListener('resize', updateSizing);
  }, []);

  const goToSlide = (index) => {
    if (totalSlides <= 0) return;
    const newSlide = Math.max(0, Math.min(index, totalSlides - 1));
    setCurrentSlide(newSlide);

    if (isMobile && scrollContainerRef.current) {
      const left = newSlide * (cardWidth + gapSize);
      scrollContainerRef.current.scrollTo({ left, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!isMobile) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const rawIndex = Math.round(container.scrollLeft / (cardWidth + gapSize));
        const nextIndex = Math.max(0, Math.min(rawIndex, totalSlides - 1));
        setCurrentSlide((prev) => (prev === nextIndex ? prev : nextIndex));
      });
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      container.removeEventListener('scroll', onScroll);
    };
  }, [isMobile, cardWidth, totalSlides]);

  if (!reviews || reviews.length === 0) {
    return <p>{t('reviews.no_reviews') || 'No reviews available at the moment.'}</p>;
  }

  const carouselStyle = isMobile
    ? undefined
    : {
        transform: `translateX(-${activeSlide * visibleCards * (cardWidth + gapSize)}px)`,
        display: 'flex',
        gap: `${gapSize}px`,
        transition: 'transform 0.5s ease-in-out',
        width: 'fit-content',
      };
  
  return (
    <div className="reviews">
      <div className="reviewsGridContainer" ref={scrollContainerRef}>
        <div className="reviewsGrid" style={carouselStyle}>
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
            onClick={() => goToSlide(activeSlide - 1)}
            disabled={activeSlide === 0}
            style={{ opacity: activeSlide === 0 ? '0.5' : '1' }}
          >
            &lsaquo;
          </button>
          <div className="reviewsNavDots">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div 
                key={i} 
                className={`reviewsNavDot ${i === activeSlide ? 'active' : ''}`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
          <button 
            className="reviewsNavNext" 
            aria-label={t('reviews.next') || "Next"} 
            onClick={() => goToSlide(activeSlide + 1)}
            disabled={activeSlide === totalSlides - 1}
            style={{ opacity: activeSlide === totalSlides - 1 ? '0.5' : '1' }}
          >
            &rsaquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
