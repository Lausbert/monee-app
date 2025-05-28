import { getTranslations, getMarkdownContent, parseMarkdown } from '@/lib/i18n';
import siteConfig from '@/lib/siteConfig';
import { remark } from 'remark';
import html from 'remark-html';
import Head from 'next/head';
import Header from '@/components/Header';

export async function getStaticProps({ locale }) {
  const currentLocale = locale || siteConfig.defaultLanguage;
  const commonTranslations = await getTranslations(currentLocale, 'common');
  const pageTranslations = await getTranslations(currentLocale, 'privacy');
  const markdownContent = await getMarkdownContent(currentLocale, 'privacy');
  
  // Get all translations for global context
  const allTranslations = await getTranslations(currentLocale);
  
  // Global translations for all pages
  const globalTranslations = {
    ...allTranslations, // Contains 'global' and other top-level sections from the main YAML file
    common: commonTranslations, // Explicitly include/override common translations
  };
  
  let contentHtml = '';
  let frontmatter = {};
  if (markdownContent) {
    const { frontmatter: fm, content } = parseMarkdown(markdownContent);
    frontmatter = fm;
    
    // Replace template variables with actual values from siteConfig
    const processedMarkdown = content.replace(/{{ site\.email_address }}/g, siteConfig.email_address);
    
    const processedContent = await remark().use(html).process(processedMarkdown);
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
    },
  };
}

export default function PrivacyPage({ commonTranslations, pageTranslations, contentHtml, frontmatter, currentLocale }) {
  // Determine title and description
  const title = pageTranslations?.title || frontmatter?.title || commonTranslations?.app_name || 'Privacy Policy'; // commonTranslations.app_name as a general fallback
  const description = pageTranslations?.description || frontmatter?.description || commonTranslations?.app_description || 'Our privacy policy details.'; // commonTranslations.app_description as a general fallback

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
        <link rel="canonical" href={`https://monee-app.com/${currentLocale !== 'en' ? currentLocale + '/' : ''}privacy/`} />
        
        {/* Language alternates */}
        <link rel="alternate" hreflang="en" href="https://monee-app.com/privacy/" />
        <link rel="alternate" hreflang="de" href="https://monee-app.com/de/privacy/" />
        <link rel="alternate" hreflang="fr" href="https://monee-app.com/fr/privacy/" />
        <link rel="alternate" hreflang="x-default" href="https://monee-app.com/privacy/" />
      </Head>
      
      <div className="headerBackground subPageHeaderBackground">
        <div className="container subPageContainer">
          <Header translations={commonTranslations} />
          <article className="page markdown-body">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </article>
        </div>
      </div>
    </>
  );
}
