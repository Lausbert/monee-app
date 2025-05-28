import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import siteConfig from '@/lib/siteConfig';
import useTranslations from '@/hooks/useTranslations';

const Header = ({ translations }) => {  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslations(translations);
  
  // Get app_name value from translations first, then fallback to siteConfig
  const appName = translations?.newsletter?.app_name || siteConfig.app_name;
  const appIcon = siteConfig.app_icon;

  return (
    <header>
      <div className="logo">
        <div className="appIconShadow">
          <svg width="0" height="0" style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
            <defs>              
              <clipPath id="shape">
                <path id="shape" className="cls-1" d="M6181.23,233.709v-1.792c0-.5-0.02-1-0.02-1.523a24.257,24.257,0,0,0-.28-3.3,11.207,11.207,0,0,0-1.04-3.132,10.683,10.683,0,0,0-1.95-2.679,10.384,10.384,0,0,0-2.68-1.943,10.806,10.806,0,0,0-3.13-1.038,19.588,19.588,0,0,0-3.3-.285c-0.5-.017-1-0.017-1.52-0.017h-22.39c-0.51,0-1.01.017-1.53,0.017a24.041,24.041,0,0,0-3.3.285,11.009,11.009,0,0,0-3.13,1.038,10.491,10.491,0,0,0-4.62,4.622,10.893,10.893,0,0,0-1.04,3.132,19.2,19.2,0,0,0-.28,3.3c-0.02.5-.02,1-0.02,1.523v22.392c0,0.5.02,1,.02,1.524a24.257,24.257,0,0,0,.28,3.3,10.9,10.9,0,0,0,1.04,3.132,10.491,10.491,0,0,0,4.62,4.622,11.04,11.04,0,0,0,3.13,1.038,19.891,19.891,0,0,0,3.3.285c0.51,0.017,1.01.017,1.53,0.017h22.39c0.5,0,1-.017,1.52-0.017a24.221,24.221,0,0,0,3.3-.285,10.836,10.836,0,0,0,3.13-1.038,10.408,10.408,0,0,0,2.68-1.943,10.683,10.683,0,0,0,1.95-2.679,11.217,11.217,0,0,0,1.04-3.132,20.257,20.257,0,0,0,.28-3.3c0.02-.5.02-1,0.02-1.524v-20.6h0Z" transform="translate(-6131 -218)"/>
              </clipPath>
            </defs>
          </svg>          {router.pathname !== '/' ? (
            <Link href={`/${locale}/`} legacyBehavior>
              <a target="_self" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {appIcon && <Image className="headerIcon" src={appIcon} alt={`${appName} icon`} width={50} height={50} style={{ clipPath: 'url(#shape)', position: 'static' }} />}
              </a>
            </Link>
          ) : (
            appIcon && <Image className="headerIcon" src={appIcon} alt={`${appName} icon`} width={50} height={50} style={{ clipPath: 'url(#shape)', position: 'static' }} />
          )}
          <div className="divider"></div>
        </div>
        <p className="headerName">{appName}</p>
      </div>
    </header>
  );
};

export default Header;
