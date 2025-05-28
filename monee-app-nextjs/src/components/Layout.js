import Head from 'next/head';
import { useRouter } from 'next/router';
import siteConfig from '../lib/siteConfig'; // Corrected import path
import Footer from './Footer'; // Import the Footer component
import HeaderBackground from './HeaderBackground'; // Import the new HeaderBackground component

export default function Layout({ children, pageTitle, title, pageDescription, description, pageKeywords, translations, globalTranslations }) {
  const router = useRouter();
  const { locale, defaultLocale, asPath } = router;

  // Use provided values, fall back to translations if available, then to siteConfig
  const finalTitle = pageTitle || title || (translations?.title) || siteConfig.app_name;
  const finalDescription = pageDescription || description || (translations?.description) || siteConfig.app_description;
  const finalKeywords = pageKeywords || (translations?.keywords) || siteConfig.app_keywords;
  let canonicalUrl = siteConfig.site_url || ''; // Use site_url from siteConfig, with fallback
  if (locale && locale !== defaultLocale) {
    canonicalUrl += `/${locale}${asPath.startsWith(`/${locale}`) ? asPath.substring(locale.length + 1) : asPath}`;
  } else {
    canonicalUrl += asPath;
  }
  canonicalUrl = canonicalUrl.replace(/([^:])\/\/+/g, "$1"); // Remove double slashes
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={finalDescription} />

        {asPath.includes('/invite') && (
          <>
            <meta name="robots" content="noindex,nofollow" />
            <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, proxy-revalidate" />
            <meta httpEquiv="Pragma" content="no-cache" />
            <meta httpEquiv="Expires" content="0" />
          </>
        )}

        {finalKeywords && <meta name="keywords" content={finalKeywords} />}

        <meta property="og:title" content={finalTitle} />
        <meta property="og:description" content={finalDescription} />
        {siteConfig.app_icon && <meta property="og:image" content={`${siteConfig.site_url}${siteConfig.app_icon}`} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />

        <title>{finalTitle}</title>

        {siteConfig.app_icon && <link rel="shortcut icon" href={siteConfig.app_icon} />}

        <link rel="canonical" href={canonicalUrl} />
        {siteConfig.languages && siteConfig.languages.map((lang) => {
          let langPath = asPath;
          if (asPath.startsWith(`/${locale}`)) {
            langPath = asPath.substring(locale.length + 1) || '/';
          }
          if (langPath.startsWith('/')) {
            langPath = langPath.substring(1);
          }
          const href = lang === (siteConfig.defaultLanguage || siteConfig.default_lang) ? `${siteConfig.site_url}/${langPath}` : `${siteConfig.site_url}/${lang}/${langPath}`;
          return <link key={lang} rel="alternate" hreflang={lang} href={href.replace(/([^:])\/\/+/g, "$1")} />;
        })}
        <link rel="alternate" hreflang="x-default" href={`${siteConfig.site_url}${asPath.startsWith(`/${locale}`) ? asPath.substring(locale.length + 1) : asPath}`.replace(/([^:])\/\/+/g, "$1")} />        {siteConfig.enable_smart_app_banner && siteConfig.ios_app_id && (
          <meta name="apple-itunes-app" content={`app-id=${siteConfig.ios_app_id}`} />
        )}
      </Head>
      <HeaderBackground /> {/* Add the background image wrapper component */}
      <main>{children}</main>
      <Footer />
    </>
  );
}
