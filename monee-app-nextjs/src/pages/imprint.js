import { getTranslations, getMarkdownContent, parseMarkdown } from '@/lib/i18n';
import siteConfig from '@/lib/siteConfig';
import { remark } from 'remark';
import html from 'remark-html';
import Head from 'next/head';
import Header from '@/components/Header';

export async function getStaticProps({ locale }) {
  const currentLocale = locale || siteConfig.defaultLanguage;
  const allTranslations = await getTranslations(currentLocale);
  const pageTranslations = await getTranslations(currentLocale, 'imprint');
  const markdownContent = await getMarkdownContent(currentLocale, 'imprint');
  
  // Global translations for all pages
  const globalTranslations = {
    ...allTranslations,
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
      translations: allTranslations,
      pageTranslations,
      contentHtml,
      frontmatter,
      currentLocale,
      globalTranslations,
    },
  };
}

export default function ImprintPage({ translations, pageTranslations, contentHtml, frontmatter, currentLocale }) {
  // Determine title and description like in the original
  const title = translations?.titles?.imprint || 'Imprint';
  const description = translations?.titles?.imprint + ': ' + translations?.global?.app_description || 'Imprint Monee';

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
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://monee-app.com/assets/appicon.webp" />
        <meta property="og:url" content={`https://monee-app.com/${currentLocale !== 'en' ? currentLocale + '/' : ''}imprint/`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://monee-app.com/${currentLocale !== 'en' ? currentLocale + '/' : ''}imprint/`} />
        
        {/* Language alternates */}
        <link rel="alternate" hreflang="en" href="https://monee-app.com/imprint/" />
        <link rel="alternate" hreflang="de" href="https://monee-app.com/de/imprint/" />
        <link rel="alternate" hreflang="fr" href="https://monee-app.com/fr/imprint/" />
        <link rel="alternate" hreflang="es" href="https://monee-app.com/es/imprint/" />
        <link rel="alternate" hreflang="pt" href="https://monee-app.com/pt/imprint/" />
        <link rel="alternate" hreflang="it" href="https://monee-app.com/it/imprint/" />
        <link rel="alternate" hreflang="ru" href="https://monee-app.com/ru/imprint/" />
        <link rel="alternate" hreflang="hi" href="https://monee-app.com/hi/imprint/" />
        <link rel="alternate" hreflang="el" href="https://monee-app.com/el/imprint/" />
        <link rel="alternate" hreflang="tr" href="https://monee-app.com/tr/imprint/" />
        <link rel="alternate" hreflang="x-default" href="https://monee-app.com/imprint/" />
      </Head>
      
      <div className="headerBackground subPageHeaderBackground">
        <div className="container subPageContainer">
          <Header translations={translations} />
          <article className="page markdown-body">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </article>
        </div>
      </div>
    </>
  );
}
