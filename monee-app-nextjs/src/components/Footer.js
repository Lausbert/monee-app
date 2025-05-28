import Link from 'next/link';
import siteConfig from '@/lib/siteConfig';
import useTranslations from '@/hooks/useTranslations';
import { useRouter } from 'next/router';

const Footer = () => {
  const { locale } = useRouter();
  const { t } = useTranslations(); // Assuming 'footer' section in YAML if specific translations are needed

  // Fallback for footer_links if not present in siteConfig or not an array
  const footerNavigationLinks = Array.isArray(siteConfig.footer_links) ? siteConfig.footer_links : [];

  return (
    <footer>
      {siteConfig.your_name && (
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
          
          const url = link.url.startsWith('/') ? `/${locale}${link.url}` : link.url;

          return (
            <Link href={url} key={link.url} legacyBehavior>
              <a target={link.url.startsWith('http') ? '_blank' : '_self'} rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}>
                {title}
              </a>
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;
