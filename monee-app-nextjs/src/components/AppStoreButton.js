import Image from 'next/image';
import { useRouter } from 'next/router';
// --- POSTHOG DISABLED: uncomment to re-enable ---
// import posthog from 'posthog-js';
import useTranslations from '../hooks/useTranslations';
import siteConfig from '../lib/siteConfig';

export default function AppStoreButton({ playstoreLink, appstoreLink, appStoreData, translations }) {
  const router = useRouter();
  const { t, isLoading } = useTranslations(translations);

  if (isLoading) return <div>Loading...</div>;

  const playStoreAlt = t('global.play_store_badge_alt') || 'Download on Google Play';
  const appStoreAlt = t('global.app_store_badge_alt') || 'Download on the App Store';
  
  // Use App Store data if available, otherwise fall back to props or siteConfig
  const finalAppStoreLink = appStoreData?.trackViewUrl || appstoreLink;

  const trackStoreClick = (platform) => {
    // --- POSTHOG DISABLED ---
    /*
    try {
      if (!posthog || typeof posthog.capture !== 'function') return;
      const isBlog = router?.pathname === '/blog/[slug]';
      posthog.capture('appstore_button_click', {
        platform,
        is_blog: isBlog,
      });
    } catch (e) {
      // no-op
    }
    */
    // --- END POSTHOG DISABLED ---
  };

  return (
    <div className="downloadButtonsContainer">
      {playstoreLink && (
        <a
          href={playstoreLink}
          className="playStoreLink"
          target="_blank"
          rel="noopener"
          onClick={() => trackStoreClick('android')}
        >
          <div className="badgeContainer">
            <Image 
              className="playStore" 
              src="/assets/playstore.webp" 
              alt={playStoreAlt} 
              width={240} 
              height={75} 
              unoptimized
            />
          </div>
        </a>
      )}
      
      {(finalAppStoreLink || siteConfig.appstore_link) && (
        <a
          className="appStoreLink"
          href={finalAppStoreLink || siteConfig.appstore_link}
          onClick={() => trackStoreClick('ios')}
        >
          <div className="badgeContainer">
            <Image 
              className="appStore" 
              src="/assets/appstore.webp" 
              alt={appStoreAlt} 
              width={240} 
              height={75}
              unoptimized
            />
          </div>
        </a>
      )}
    </div>
  );
}
