import { getTranslations, getMarkdownContent, parseMarkdown } from '@/lib/i18n';
import siteConfig from '@/lib/siteConfig';
import { remark } from 'remark';
import html from 'remark-html';
import Head from 'next/head';
import Header from '@/components/Header';
import AppStoreButton from '@/components/AppStoreButton';

export async function getStaticProps({ locale }) {
  const currentLocale = locale || siteConfig.defaultLanguage;
  const allTranslations = await getTranslations(currentLocale);
  const markdownContent = await getMarkdownContent(currentLocale, 'invite');
  
  let contentHtml = '';
  if (markdownContent) {
    const { content } = parseMarkdown(markdownContent);
    const processedContent = await remark().use(html).process(content);
    contentHtml = processedContent.toString();
  }

  return {
    props: {
      translations: allTranslations || {},
      contentHtml,
      currentLocale,
      appName: allTranslations?.global?.app_name || '',
      appDescription: allTranslations?.global?.app_description || '',
    },
  };
}

export default function InvitePage({ translations, contentHtml, currentLocale, appName, appDescription }) {

  return (
    <>
      <Head>
        <title>{appName}</title>
        <meta name="description" content={appDescription} />
        <link rel="shortcut icon" href="/assets/appicon.webp" />
        
        {/* Essential meta tags for the browser tab */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        
        {/* Privacy-related meta tags for invite pages */}
        <meta name="robots" content="noindex,nofollow" />
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, proxy-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* Open Graph for social media */}
        <meta property="og:title" content={appName} />
        <meta property="og:description" content={appDescription} />
        <meta property="og:image" content="https://monee-app.com/assets/appicon.webp" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://monee-app.com/${currentLocale !== 'en' ? currentLocale + '/' : ''}invite/`} />
        
        {/* Language alternates */}
        <link rel="alternate" hreflang="en" href="https://monee-app.com/invite/" />
        <link rel="alternate" hreflang="de" href="https://monee-app.com/de/invite/" />
        <link rel="alternate" hreflang="fr" href="https://monee-app.com/fr/invite/" />
        <link rel="alternate" hreflang="es" href="https://monee-app.com/es/invite/" />
        <link rel="alternate" hreflang="pt" href="https://monee-app.com/pt/invite/" />
        <link rel="alternate" hreflang="it" href="https://monee-app.com/it/invite/" />
        <link rel="alternate" hreflang="ru" href="https://monee-app.com/ru/invite/" />
        <link rel="alternate" hreflang="hi" href="https://monee-app.com/hi/invite/" />
        <link rel="alternate" hreflang="el" href="https://monee-app.com/el/invite/" />
        <link rel="alternate" hreflang="x-default" href="https://monee-app.com/invite/" />
      </Head>
      
      <div className="headerBackground subPageHeaderBackground">
        <div className="container subPageContainer">
          <Header translations={translations} />
          <article className="page markdown-body">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            
            <AppStoreButton 
              playstoreLink={siteConfig.playstore_link}
              appstoreLink={siteConfig.appstore_link}
              translations={translations}
            />
          </article>
        </div>
      </div>
    </>
  );
}
