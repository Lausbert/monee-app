import useTranslations from '../hooks/useTranslations';

export default function Award({ translations }) {
  const { t, isLoading } = useTranslations();

  if (isLoading) {
    // You might want a placeholder or null during loading
    return <div className="award-section">Loading award...</div>;
  }

  // Use translations object if provided, or fall back to global keys
  const awardLinkKey = translations?.link ? 'link' : 'global.award.link';
  const awardTitleKey = translations?.title ? 'title' : 'global.award.title';
  
  const link = translations ? 
    (translations.link || t('global.award.link')) : 
    t('global.award.link');
  
  const title = translations ? 
    (translations.title || t('global.award.title')) : 
    t('global.award.title');

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="award-link">
      <div className="award-section">
        <div className="award-container">
          <div className="award-content">
            <div className="award-header">
              <h2 className="award-title">{title}</h2>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
