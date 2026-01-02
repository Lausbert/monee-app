import Link from 'next/link';
import siteConfig from '@/lib/siteConfig';
import useTranslations from '@/hooks/useTranslations';
import { useRouter } from 'next/router';

const Footer = () => {
  const { locale } = useRouter();
  const { t } = useTranslations(); // Assuming 'footer' section in YAML if specific translations are needed

  // Fallback for footer_links if not present in siteConfig or not an array
  const footerNavigationLinks = Array.isArray(siteConfig.footer_links) ? siteConfig.footer_links : [];
  const awardTitle = t('global.award.title');
  const awardShortTitle = t('global.award.short_title');
  const awardLink = t('global.award.link');
  const awardLabel =
    awardShortTitle && awardShortTitle !== 'global.award.short_title'
      ? awardShortTitle
      : awardTitle;
  const showAward =
    awardLabel &&
    awardLink &&
    awardLabel !== 'global.award.title' &&
    awardLink !== 'global.award.link';
  const showMadeBy = Boolean(siteConfig.your_name);

  return (
    <footer>
      {showMadeBy && (
        <p className="footerText">
          Made by{' '}
          {siteConfig.your_link ? (
            <a href={siteConfig.your_link} target="_blank" rel="noopener noreferrer">
              {siteConfig.your_name}
            </a>
          ) : (
            siteConfig.your_name
          )}
          {siteConfig.your_city && ` in ${siteConfig.your_city}`}
        </p>
      )}

      <div className="footerIcons">
        {siteConfig.facebook_username && (
          <a href={`https://facebook.com/${siteConfig.facebook_username}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <span className="fa-stack fa-1x">
              <i className="socialIconBack fas fa-circle fa-stack-2x"></i>
              <i className="socialIconTop fab fa-facebook fa-stack-1x"></i>
            </span>
          </a>
        )}
        {siteConfig.twitter_username && (
          <a href={`https://twitter.com/${siteConfig.twitter_username}`} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <span className="fa-stack fa-1x">
              <i className="socialIconBack fas fa-circle fa-stack-2x"></i>
              <i className="socialIconTop fab fa-twitter fa-stack-1x"></i>
            </span>
          </a>
        )}
        {siteConfig.instagram_username && (
          <a href={`https://instagram.com/${siteConfig.instagram_username}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <span className="fa-stack fa-1x">
              <i className="socialIconBack fas fa-circle fa-stack-2x"></i>
              <i className="socialIconTop fab fa-instagram fa-stack-1x"></i>
            </span>
          </a>
        )}
        {siteConfig.github_username && (
          <a href={`https://github.com/${siteConfig.github_username}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <span className="fa-stack fa-1x">
              <i className="socialIconBack fas fa-circle fa-stack-2x"></i>
              <i className="socialIconTop fab fa-github fa-stack-1x"></i>
            </span>
          </a>
        )}
        {siteConfig.product_hunt_link && (
          <a href={siteConfig.product_hunt_link} target="_blank" rel="noopener noreferrer" aria-label="Product Hunt">
            <span className="fa-stack fa-1x">
              <i className="socialIconBack fas fa-circle fa-stack-2x"></i>
              <i className="socialIconTop fab fa-product-hunt fa-stack-1x"></i>
            </span>
          </a>
        )}
        {siteConfig.email_address && (
          <a href={`mailto:${siteConfig.email_address}`} aria-label="Email">
            <span className="fa-stack fa-1x">
              <i className="socialIconBack fas fa-circle fa-stack-2x"></i>
              <i className="socialIconTop fas fa-envelope fa-stack-1x"></i>
            </span>
          </a>
        )}
      </div>      <div className="footerLinks">
        {footerNavigationLinks.map((link) => {
          // Use translation for title, fallback to link.title
          let title = link.title; // Default fallback

          // Try to get translation using title_key if available
          if (link.title_key) {
            const translatedTitle = t(link.title_key);
            // Only use translation if it's different from the key (meaning translation was found)
            if (translatedTitle && translatedTitle !== link.title_key) {
              title = translatedTitle;
            }
          }

          // Hide blog link for locales where blog is disabled
          const isBlogLink = typeof link.url === 'string' && link.url.startsWith('/blog');
          const enabledBlogLocales = Array.isArray(siteConfig.blog_enabled_locales) ? siteConfig.blog_enabled_locales : [];
          if (isBlogLink && !enabledBlogLocales.includes(locale)) {
            return null;
          }

          const url = link.url.startsWith('/') ? `/${locale !== 'en' ? locale + '/' : ''}${link.url.substring(1)}` : link.url;

          return (
            <Link
              href={url}
              key={link.url}
              target={link.url.startsWith('http') ? '_blank' : '_self'}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
            >
              {title}
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;
