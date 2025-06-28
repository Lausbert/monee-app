import { getTranslations, getMarkdownContent, parseMarkdown } from '@/lib/i18n';
import siteConfig from '@/lib/siteConfig';
import { remark } from 'remark';
import html from 'remark-html';
import Head from 'next/head';
import Header from '@/components/Header';
import Newsletter from '@/components/Newsletter';
import AppStoreButton from '@/components/AppStoreButton';
import { useEffect } from 'react';

export async function getStaticProps({ locale }) {
  const currentLocale = locale || siteConfig.defaultLanguage;
  const allTranslations = await getTranslations(currentLocale);
  const pageTranslations = await getTranslations(currentLocale, 'android');
  const markdownContent = await getMarkdownContent(currentLocale, 'android');
  
  // Global translations for all pages
  const globalTranslations = {
    ...allTranslations,
    global: allTranslations?.global || {},
    features: allTranslations?.features || []
  };
  
  let contentHtml = '';
  let frontmatter = {};

  if (markdownContent) {
    const { frontmatter: fm, content } = parseMarkdown(markdownContent);
    frontmatter = fm;
    const processedContent = await remark().use(html).process(content);
    contentHtml = processedContent.toString();
  }
  return {
    props: {
      translations: allTranslations,
      pageTranslations,
      contentHtml,
      frontmatter,
      currentLocale,
      globalTranslations,
      allTranslations,
      playstoreLink: siteConfig.playstore_link,
      appstoreLink: siteConfig.appstore_link,
    },
  };
}

export default function AndroidPage({ translations, pageTranslations, contentHtml, frontmatter, currentLocale, globalTranslations, allTranslations, playstoreLink, appstoreLink }) {
  // Determine title and description like in the original
  const title = pageTranslations?.title || frontmatter?.title || translations?.global?.app_name || 'Monee - Budget & Expense Tracker';
  const description = pageTranslations?.description || frontmatter?.description || translations?.global?.app_description || 'Monee puts you back in control of your finances.';

  // Add subPageBody class to body element
  useEffect(() => {
    document.body.classList.add('subPageBody');
    return () => {
      document.body.classList.remove('subPageBody');
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="shortcut icon" href="/assets/appicon.webp" />
        
        {/* Essential meta tags for the browser tab */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        
        {/* Open Graph for social media */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://monee-app.com/assets/appicon.webp" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://monee-app.com/${currentLocale !== 'en' ? currentLocale + '/' : ''}android/`} />
        
        {/* Language alternates */}
        <link rel="alternate" hreflang="en" href="https://monee-app.com/android/" />
        <link rel="alternate" hreflang="de" href="https://monee-app.com/de/android/" />
        <link rel="alternate" hreflang="fr" href="https://monee-app.com/fr/android/" />
        <link rel="alternate" hreflang="x-default" href="https://monee-app.com/android/" />        {/* Smart App Banner */}
        <meta name="apple-itunes-app" content="app-id=1617877213" />
      </Head>
      
      <div className="headerBackground subPageHeaderBackground">
        <div className="container subPageContainer">
          <Header translations={translations} />
          <article className="page markdown-body">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              {/* Download Buttons */}
            <AppStoreButton 
              playstoreLink="android"
              appstoreLink={appstoreLink || "https://apps.apple.com/app/monee-budget-expense-tracker/id1617877213"}
              translations={allTranslations}
            />
              {/* Newsletter */}
            <Newsletter translations={allTranslations} />
          </article>
        </div>
      </div>
    </>
  );
}
