import useTranslations from '../hooks/useTranslations';

export default function Features({ featuresListKey, translations }) {
  const { t, isLoading } = useTranslations(translations);
  
  if (isLoading) {
    return <div>Loading features...</div>;
  }
  
  // Direct access to global.features if available in translations
  let features = [];
  
  // Try to access using direct access first if translations has global.features
  if (translations?.global?.features && Array.isArray(translations.global.features)) {
    features = translations.global.features;
  } 
  // Fallback to using featuresListKey if specified
  else if (featuresListKey && translations) {
    const pathParts = featuresListKey.split('.');
    let current = translations;
    
    // Navigate through the object structure
    for (const part of pathParts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        current = null;
        break;
      }
    }
    
    // Set features to the found array
    if (current && Array.isArray(current)) {
      features = current;
    } 
  }

  return (
    <div className="features">
      {features && features.length > 0 ? (
        features.map((feature, index) => (
          <div key={index} className="feature">
            <div>
              {feature.emoji && (
                <span className="emoji-icon">
                  {feature.emoji}
                </span>
              )}
            </div>
            <div className="featureText">
              {feature.title && <h3>{feature.title}</h3>}
              {feature.description && <p>{feature.description}</p>}
            </div>
          </div>
        ))
      ) : (
        <div>No features found to display</div>
      )}
    </div>
  );
}
