import Image from 'next/image';
import useTranslations from '../hooks/useTranslations';
import siteConfig from '../lib/siteConfig';

export default function AppStoreButton({ playstoreLink, appstoreLink }) {
  const { t, isLoading } = useTranslations();

  if (isLoading) return <div>Loading...</div>;

  const playStoreAlt = t('global.play_store_badge_alt') || 'Coming soon on Google Play';
  const appStoreAlt = t('global.app_store_badge_alt') || 'Download on the App Store';
  const comingSoonText = t('global.coming_soon') || 'Coming Soon';

  return (
    <div className="downloadButtonsContainer">
      {playstoreLink && (
        <a className="playStoreLink" href={playstoreLink.startsWith('/') ? playstoreLink : `/${playstoreLink}`}>
          <div className="badgeContainer">            <Image 
              className="playStore" 
              src="/assets/playstore.webp" 
              alt={playStoreAlt} 
              width={240} 
              height={75} 
            />
            {playstoreLink === 'android' && (
              <div className="comingSoonBadge">{comingSoonText}</div>
            )}
          </div>
        </a>
      )}
      
      {(appstoreLink || siteConfig.appstore_link) && (
        <a className="appStoreLink" href={appstoreLink || siteConfig.appstore_link}>
          <div className="badgeContainer">            <Image 
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
