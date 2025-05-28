import Layout from '@/components/Layout';
import { getTranslations, getMarkdownContent, parseMarkdown } from '@/lib/i18n';
import siteConfig from '@/lib/siteConfig';
import { remark } from 'remark';
import html from 'remark-html';

export async function getStaticProps({ locale }) {
  const currentLocale = locale || siteConfig.defaultLanguage;
  const commonTranslations = await getTranslations(currentLocale, 'common');
  const pageTranslations = await getTranslations(currentLocale, 'invite');
  const markdownContent = await getMarkdownContent(currentLocale, 'invite');
  
  // Get all translations for global context
  const allTranslations = await getTranslations(currentLocale);

  let contentHtml = '';
  let frontmatter = {};

  if (markdownContent) {
    const { frontmatter: fm, content } = parseMarkdown(markdownContent);
    frontmatter = fm;
    const processedContent = await remark().use(html).process(content);
    contentHtml = processedContent.toString();
  }
  // Global translations for all pages
  const globalTranslations = {
    ...allTranslations,
    common: commonTranslations,
    global: allTranslations?.global || {}
  };

  return {
    props: {
      commonTranslations,
      pageTranslations,
      contentHtml,
      frontmatter,
      currentLocale,      globalTranslations,
    },
  };
}

export default function InvitePage({ commonTranslations, pageTranslations, contentHtml, frontmatter, currentLocale }) {
  const title = pageTranslations?.title || frontmatter?.title || commonTranslations?.invite_title || 'Invite Friends';
  const description = pageTranslations?.description || frontmatter?.description || commonTranslations?.app_description;

  return (
    <Layout translations={commonTranslations} title={title} description={description} currentLocale={currentLocale}>
      <article className="page-content">
        <h1>{pageTranslations?.headline || frontmatter?.title || title}</h1>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </Layout>
  );
}
