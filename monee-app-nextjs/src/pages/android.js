import { getTranslations, getMarkdownContent, parseMarkdown } from '@/lib/i18n';
import siteConfig from '@/lib/siteConfig';
import { remark } from 'remark';
import html from 'remark-html';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Newsletter from '@/components/Newsletter';
import { useEffect } from 'react';

export async function getStaticProps({ locale }) {
  const currentLocale = locale || siteConfig.defaultLanguage;
  const commonTranslations = await getTranslations(currentLocale, 'common');
  const pageTranslations = await getTranslations(currentLocale, 'android');
  const markdownContent = await getMarkdownContent(currentLocale, 'android');
  
  // Get all translations for global context
  const allTranslations = await getTranslations(currentLocale);
  
  // Global translations for all pages
  const globalTranslations = {
    ...allTranslations,
    common: commonTranslations,
    global: allTranslations?.global || {}
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
      commonTranslations,
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

export default function AndroidPage({ commonTranslations, pageTranslations, contentHtml, frontmatter, currentLocale, globalTranslations, allTranslations, playstoreLink, appstoreLink }) {
  // Determine title and description like in the original
  const title = pageTranslations?.title || frontmatter?.title || commonTranslations?.android_title || 'Monee - Budget & Expense Tracker';
  const description = pageTranslations?.description || frontmatter?.description || commonTranslations?.app_description || 'Monee puts you back in control of your finances.';

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
          <Header translations={commonTranslations} />
          <article className="page markdown-body">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              {/* Download Buttons */}
            <div className="downloadButtonsContainer">              <Link href="/android" className="playStoreLink">
                <div className="badgeContainer">
                  <Image 
                    className="playStore" 
                    src="/assets/playstore.webp" 
                    alt="Coming soon on Google Play"
                    width={200}
                    height={75}
                    priority
                  />
                  <div className="comingSoonBadge">Coming Soon</div>
                </div>
              </Link>
              <a className="appStoreLink" href={appstoreLink || "https://apps.apple.com/app/monee-budget-expense-tracker/id1617877213"}>
                <div className="badgeContainer">
                  <Image 
                    className="appStore" 
                    src="/assets/appstore.webp" 
                    alt="Download on the App Store"
                    width={200}
                    height={75}
                    priority
                  />
                </div>
              </a></div>
              {/* Newsletter */}
            <Newsletter translations={allTranslations} />
          </article>
        </div>
      </div>
    </>
  );
}
