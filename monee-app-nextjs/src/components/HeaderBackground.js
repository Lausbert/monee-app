import { useRouter } from 'next/router';
import Image from 'next/image';
import siteConfig from '@/lib/siteConfig';

export default function HeaderBackground() {
  const router = useRouter();
  const isHomePage = router.pathname === '/' || router.pathname === '/[locale]';
  
  if (!isHomePage) {
    return <div className="subPageHeaderBackground"></div>;
  }
  
  return (
    <div className="imageWrapper">
      <Image
        src={siteConfig.cover_image}
        alt="Header background"
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'top',
          zIndex: -2
        }}
        className="header-background-image"
      />
      <Image
        src="/assets/mobileheaderimage.jpg"
        alt="Mobile header background"
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'top',
          zIndex: -2
        }}
        className="header-background-image-mobile"
      />
      <div className="header-gradient-overlay"></div>
    </div>
  );
}
