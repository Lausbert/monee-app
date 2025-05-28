import Image from 'next/image';
import AppStoreButton from './AppStoreButton'; // Assuming AppStoreButton is in the same directory
import useTranslations from '../hooks/useTranslations';
import siteConfig from '../lib/siteConfig';

// SVG for appIconShadow - Using the squircle shape to clip the app icon
const AppIconShadowSVG = () => (
  <svg width="0" height="0">
    <defs>
      <clipPath id="shape120">
        <path 
          id="shape" 
          className="cls-1" 
          d="M6821,495.533v-4.281c0-1.2-.04-2.4-0.04-3.642a57.7,57.7,0,0,0-.68-7.882,26.144,26.144,0,0,0-2.48-7.483,25.115,25.115,0,0,0-11.04-11.044,26.118,26.118,0,0,0-7.49-2.481,47.28,47.28,0,0,0-7.88-.68c-1.2-.04-2.4-0.04-3.64-0.04h-53.5c-1.2,0-2.4.04-3.64,0.04a57.813,57.813,0,0,0-7.88,.68,26.323,26.323,0,0,0-7.49,2.481,25.115,25.115,0,0,0-11.04,11.044,26.144,26.144,0,0,0-2.48,7.483,47.313,47.313,0,0,0-.68,7.882c-0.04,1.2-.04,2.4-0.04,3.642v53.5c0,1.2.04,2.4,0.04,3.641a57.7,57.7,0,0,0,.68,7.883,26.137,26.137,0,0,0,2.48,7.482,25.115,25.115,0,0,0,11.04,11.044,26.261,26.261,0,0,0,7.49,2.481,47.28,47.28,0,0,0,7.88,.68c1.2,0.04,2.4,0.04,3.64,0.04h53.5c1.2,0,2.4-.04,3.64-0.04a57.654,57.654,0,0,0,7.88-.68,26.057,26.057,0,0,0,7.49-2.481,25.115,25.115,0,0,0,11.04-11.044,26.137,26.137,0,0,0,2.48-7.482,47.316,47.316,0,0,0,.68-7.883c0.04-1.2,0.04-2.4,0.04-3.641V495.533h0Z"
          transform="translate(-6701 -458)" 
          filter="url(#f1)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default function AppInfo({ appIconUrl, appNameKey, appDescriptionKey, ratings }) {
  const { t, isLoading, translations } = useTranslations();

  if (isLoading) return <div>Loading translations...</div>;

  // Try to extract names directly from the nested translations object first
  let appName;
  let appDescription;
  
  // Check if appNameKey and appDescriptionKey are dot-notation path strings
  if (appNameKey && appNameKey.includes('.')) {
    const nameParts = appNameKey.split('.');
    let nameObj = translations;
    for (const part of nameParts) {
      nameObj = nameObj?.[part];
      if (!nameObj) break;
    }
    appName = typeof nameObj === 'string' ? nameObj : siteConfig.app_name;
  } else {
    appName = t(appNameKey) || siteConfig.app_name;
  }
  
  if (appDescriptionKey && appDescriptionKey.includes('.')) {
    const descParts = appDescriptionKey.split('.');
    let descObj = translations;
    for (const part of descParts) {
      descObj = descObj?.[part];
      if (!descObj) break;
    }
    appDescription = typeof descObj === 'string' ? descObj : siteConfig.app_description;
  } else {
    appDescription = t(appDescriptionKey) || siteConfig.app_description;
  }

  // Format the ratings exactly like the original HTML
  const ratingStars = ratings?.starsKey ? t(ratings.starsKey) : '⭐️⭐️⭐️⭐️⭐️';
  const ratingScore = ratings?.scoreKey ? t(ratings.scoreKey) : 'Global Rating: 4.9 / 5.0';
  const ratingCount = ratings?.countKey ? t(ratings.countKey) : 'Based on 4000+ Ratings & Reviews';
  const downloadCount = ratings?.downloadsKey ? t(ratings.downloadsKey) : '100.000+ Downloads worldwide';

  return (
    <div className="appInfo">      <div className="app-content-wrapper" style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'flex-start', gap: '20px' }}>
        <div className="appIconShadow">
          <AppIconShadowSVG />
          <Image 
            className="appIconLarge" 
            src={appIconUrl || siteConfig.app_icon} 
            alt={`${appName} icon`}
            width={120}
            height={120}
            priority
          />
        </div>
        <div className="appNamePriceContainer">
          <h1 className="appName" style={{ marginBottom: '15px' }}>
            {appName}
          </h1>
          <p className="appDescription" style={{ fontSize: '2rem', lineHeight: '1.5' }}>
            {appDescription}
          </p>
        </div>
      </div>
      <div className="app-ratings">
        <p className="rating-stars">{ratingStars}</p>
        <p className="rating-score">{ratingScore}</p>
        <p className="rating-count">{ratingCount}</p>
        <p className="download-count">{downloadCount}</p>
      </div>
      <div className="appButtonContainer">
        <AppStoreButton 
          playstoreLink={siteConfig.playstore_link} 
          appstoreLink={siteConfig.appstore_link} 
        />
      </div>
    </div>
  );
}
