import useTranslations from '../hooks/useTranslations';

export default function Award() {
  const { t, isLoading } = useTranslations();

  if (isLoading) {
    return <div className="award-section">Loading award...</div>;
  }

  const promoTitle = t('global.product_hunt.title');
  const showPromoTitle = promoTitle && promoTitle !== 'global.product_hunt.title';

  return (
    <a
      href="https://www.producthunt.com/products/monee?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-monee"
      target="_blank"
      rel="noopener noreferrer"
      className="award-link"
    >
      <div className="award-section">
        <div className="award-container">
          <div className="award-content">
            <div className="award-header">
              <h2 className="award-title">
                {showPromoTitle && <span>{promoTitle}</span>}
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1044516&theme=light&t=1764582520085"
                  alt="Monee - A beautifully simple way to manage your money | Product Hunt"
                  style={{ width: 250, height: 54, display: 'block' }}
                  width="250"
                  height="54"
                  loading="lazy"
                />
              </h2>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
