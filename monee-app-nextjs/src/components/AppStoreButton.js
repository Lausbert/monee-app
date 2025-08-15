import Image from 'next/image';
import useTranslations from '../hooks/useTranslations';
import siteConfig from '../lib/siteConfig';
import { getAppStoreLink } from '../lib/appstore';

export default function AppStoreButton({ playstoreLink, appstoreLink, appStoreData, translations }) {
  const { t, isLoading } = useTranslations(translations);

  if (isLoading) return <div>Loading...</div>;

  const playStoreAlt = t('global.play_store_badge_alt') || 'Download on Google Play';
  const appStoreAlt = t('global.app_store_badge_alt') || 'Download on the App Store';
  
  // Use App Store data if available, otherwise fall back to props or siteConfig
  const finalAppStoreLink = getAppStoreLink(appStoreData) || appstoreLink;

  return (
    <div className="downloadButtonsContainer">
      {playstoreLink && (
        <a href={playstoreLink} className="playStoreLink" target="_blank" rel="noopener">
          <div className="badgeContainer">
            <Image 
              className="playStore" 
              src="/assets/playstore.webp" 
              alt={playStoreAlt} 
              width={240} 
              height={75} 
            />
          </div>
        </a>
      )}
      
      {(finalAppStoreLink || siteConfig.appstore_link) && (
        <a className="appStoreLink" href={finalAppStoreLink || siteConfig.appstore_link}>
          <div className="badgeContainer">
            <Image 
              className="appStore" 
              src="/assets/appstore.webp" 
              alt={appStoreAlt} 
              width={240} 
              height={75}
            />
          </div>
        </a>
      )}
    </div>
  );
}
