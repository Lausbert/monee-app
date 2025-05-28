import Image from 'next/image';
import useTranslations from '@/hooks/useTranslations';

const IphonePreview = () => {
  const { t } = useTranslations();
  // The translation key global.app_screenshot already includes the assets/ prefix
  const screenshotFilename = t('global.app_screenshot');
  // Check if the path already includes 'assets/' and handle accordingly
  const screenshotPath = screenshotFilename ? 
    (screenshotFilename.startsWith('assets/') ? `/${screenshotFilename}` : `/assets/${screenshotFilename}`) : 
    '/assets/screenshot_en.webp'; // Fallback to a default

  return (
    <div className="iphonePreview">
      {/* Assuming the image is reasonably sized for layout, otherwise specify width/height or use layout='fill' with a sized parent */}
      <Image 
        className="iphoneScreen" 
        src={screenshotPath} 
        alt={t('global.iphone_preview_alt') || 'iPhone preview of the app'} 
        width={270} // Example width, adjust as needed or based on original CSS
        height={585} // Example height, adjust as needed or based on original CSS
        priority // Preload if it's LCP or important
      />
    </div>
  );
};

export default IphonePreview;
