import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { getBlogPostBySlug, getAllBlogPosts, markdownToHtml, getRelatedPosts } from '@/lib/blog';
import { getTranslations } from '@/lib/i18n';
import siteConfig from '@/lib/siteConfig';

export default function BlogPost({ post, content, allTranslations, commonTranslations, translatedSlugs, relatedPosts }) {
  const router = useRouter();
  const { locale } = router;

  const blogTranslations = allTranslations?.blog || {};
  const translatedAppName = allTranslations?.global?.app_name || siteConfig.app_name;
  const title = post.meta.title;
  const description = post.meta.excerpt;
  const formattedDate = new Date(post.meta.date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Head>
        <title>{`${title}`}</title>
        <meta name="description" content={description} />
        <link rel="shortcut icon" href="/assets/appicon.webp" />
        {/* Essential meta tags for the browser tab */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        {/* SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content={post.meta.author} />
        <meta name="publisher" content={translatedAppName} />
        <meta name="keywords" content={post.meta.keywords || post.meta.tags?.join(', ')} />
        {/* Article specific meta tags */}
        <meta property="article:published_time" content={new Date(post.meta.date).toISOString()} />
        {post.meta.modified && <meta property="article:modified_time" content={new Date(post.meta.modified).toISOString()} />}
        <meta property="article:author" content={post.meta.author} />
        <meta property="article:section" content="Finance" />
        {post.meta.tags && post.meta.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        {/* Open Graph for social media */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${title} | ${translatedAppName}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={post.meta.featuredImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.meta.title} />
        <meta property="og:url" content={`https://monee-app.com/${locale !== 'en' ? locale + '/' : ''}blog/${post.slug}/`} />
        <meta property="og:site_name" content={translatedAppName} />
        <meta property="og:locale" content={locale === 'en' ? 'en_US' : locale === 'de' ? 'de_DE' : 'fr_FR'} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | ${translatedAppName}`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={post.meta.featuredImage} />
        <meta name="twitter:image:alt" content={post.meta.title} />
        <meta name="twitter:site" content="@MoneeApp" />
        <meta name="twitter:creator" content="@MoneeApp" />
        {/* Canonical URL */}
        <link rel="canonical" href={`https://monee-app.com/${locale !== 'en' ? locale + '/' : ''}blog/${post.slug}/`} />
        {/* Language alternates with translated slugs */}
        {translatedSlugs.en && (
          <link rel="alternate" hreflang="en" href={`https://monee-app.com/blog/${translatedSlugs.en}/`} />
        )}
        {translatedSlugs.de && (
          <link rel="alternate" hreflang="de" href={`https://monee-app.com/de/blog/${translatedSlugs.de}/`} />
        )}
        {translatedSlugs.fr && (
          <link rel="alternate" hreflang="fr" href={`https://monee-app.com/fr/blog/${translatedSlugs.fr}/`} />
        )}
        {translatedSlugs.es && (
          <link rel="alternate" hreflang="es" href={`https://monee-app.com/es/blog/${translatedSlugs.es}/`} />
        )}
        {translatedSlugs.pt && (
          <link rel="alternate" hreflang="pt" href={`https://monee-app.com/pt/blog/${translatedSlugs.pt}/`} />
        )}
        {translatedSlugs.it && (
          <link rel="alternate" hreflang="it" href={`https://monee-app.com/it/blog/${translatedSlugs.it}/`} />
        )}
        <link rel="alternate" hreflang="x-default" href={`https://monee-app.com/blog/${translatedSlugs.en || post.slug}/`} />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.meta.title,
              description: description,
              articleBody: content.replace(/<[^>]*>/g, ''), // Strip HTML tags for plain text
              image: post.meta.featuredImage,
              author: {
                "@type": "Person",
                name: post.meta.author,
                image: "https://monee-app.com/assets/Stephan_Lerner.jpg",
                ...(post.meta.authorBio && { description: post.meta.authorBio }),
                ...(post.meta.authorLinkedIn && { sameAs: [post.meta.authorLinkedIn] }),
              },
              publisher: {
                "@type": "Person",
                name: post.meta.author,
              },
              datePublished: new Date(post.meta.date).toISOString(),
              ...(post.meta.modified && { dateModified: new Date(post.meta.modified).toISOString() }),
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://monee-app.com/${locale !== 'en' ? locale + '/' : ''}blog/${post.slug}/`,
              },
              url: `https://monee-app.com/${locale !== 'en' ? locale + '/' : ''}blog/${post.slug}/`,
              isPartOf: {
                "@type": "Blog",
                name: `${translatedAppName} Blog`,
                url: `https://monee-app.com/${locale !== 'en' ? locale + '/' : ''}blog/`,
              },
              ...(post.meta.keywords && { keywords: post.meta.keywords }),
              ...(post.meta.tags && { about: post.meta.tags.map(tag => ({ "@type": "Thing", name: tag })) }),
              // Add related posts to structured data for better SEO
              ...(relatedPosts && relatedPosts.length > 0 && {
                mentions: relatedPosts.map(relatedPost => ({
                  "@type": "BlogPosting",
                  headline: relatedPost.meta.title,
                  description: relatedPost.meta.excerpt,
                  url: `https://monee-app.com/${locale !== 'en' ? locale + '/' : ''}blog/${relatedPost.slug}/`,
                  datePublished: new Date(relatedPost.meta.date).toISOString(),
                  author: {
                    "@type": "Person",
                    name: relatedPost.meta.author
                  }
                }))
              }),
            }),
          }}
        />
      </Head>
      {/* Colored header section with navigation */}
      <div className="blog-single-header-section">
        <div className="container subPageContainer">
          <Header translations={allTranslations} />
          <div className="blog-single-container" aria-label="Blog navigation">
            {/* Title and meta in colored section */}
            <div className="blog-single-header-content">
              <h1 className="blog-single-title-header">
                {post.meta.title}
              </h1>
              <div className="blog-single-meta-header">
                <div className="blog-single-author">
                  <div className="blog-single-author-avatar">
                    <Image
                      src="/assets/Stephan_Lerner.jpg"
                      alt="Author Stephan Lerner"
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </div>
                  <div className="blog-single-author-info">
                    {post.meta.author && (
                      <p className="blog-single-author-name">
                        {post.meta.author}
                      </p>
                    )}
                    <p className="blog-single-date">
                      {blogTranslations.published_on}{' '}
                      <time dateTime={new Date(post.meta.date).toISOString()}>
                        {formattedDate}
                      </time>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="container subPageContainer">
        <div className="page">
          <div className="blog-single-container">
            <article className="blog-single-article">
              <div className="blog-single-content">
                {/* Featured image moved to content area */}
                {post.meta.featuredImage && (
                  <figure className="blog-single-featured-image">
                    <Image
                      src={post.meta.featuredImage}
                      alt={`Featured image for: ${post.meta.title}`}
                      width={800}
                      height={400}
                      style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
                      priority
                    />
                  </figure>
                )}
                <div
                  className="blog-single-body markdown-body"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                {post.meta.authorBio && (
                  <aside className="blog-single-author-bio">
                    <div className="author-bio-header">
                      <h3>{blogTranslations.about_author}</h3>
                    </div>
                    <div className="author-bio-content">
                      <div className="author-bio-avatar">
                        <Image
                          src="/assets/Stephan_Lerner.jpg"
                          alt="Author Stephan Lerner"
                          width={80}
                          height={80}
                          style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }}
                        />
                      </div>
                      <div className="author-bio-text">
                        <h4 className="author-bio-name">
                          {post.meta.author}
                        </h4>
                        <p className="author-bio-description">
                          {post.meta.authorBio}
                        </p>
                        <p className="author-bio-app-link">
                          <Link
                            href={`/${locale !== 'en' ? locale : ''}`}
                            title={blogTranslations.discover_app}
                          >
                            {blogTranslations.discover_app}
                          </Link>
                        </p>
                        {post.meta.authorLinkedIn && (
                          <div className="author-bio-social">
                            <a
                              href={post.meta.authorLinkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="author-linkedin-link"
                              aria-label={`Connect with ${post.meta.author} on LinkedIn`}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="linkedin-icon"
                                aria-hidden="true"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                              {blogTranslations.connect_linkedin}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </aside>
                )}
                {/* Related Posts Section */}
                {relatedPosts && relatedPosts.length > 0 && (
                  <aside className="blog-single-related-posts">
                    <div className="related-posts-header">
                      <h3>{blogTranslations.related_posts}</h3>
                    </div>
                    <div className="related-posts-grid">
                      {relatedPosts.map((relatedPost) => {
                        const relatedFormattedDate = new Date(relatedPost.meta.date).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        });
                        
                        return (
                          <article key={relatedPost.slug} className="related-post-card">
                            <Link href={`/${locale !== 'en' ? locale + '/' : ''}blog/${relatedPost.slug}/`}>
                              <div className="related-post-content">
                                <h4 className="related-post-title">
                                  {relatedPost.meta.title}
                                </h4>
                                <p className="related-post-excerpt">
                                  {relatedPost.meta.excerpt}
                                </p>
                                <div className="related-post-meta">
                                  <time dateTime={new Date(relatedPost.meta.date).toISOString()}>
                                    {relatedFormattedDate}
                                  </time>
                                  <span className="related-post-cta">
                                    {blogTranslations.continue_reading} →
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </article>
                        );
                      })}
                    </div>
                  </aside>
                )}
              </div>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const paths = [];
  // Create paths for all posts in all locales
  if (locales) {
    for (const locale of locales) {
      const posts = getAllBlogPosts(locale);
      const localePaths = posts.map(post => ({
        params: { slug: post.slug },
        locale,
      }));
      paths.push(...localePaths);
    }
  } else {
    // Fallback for when locales aren't available
    const locale = siteConfig.defaultLanguage || 'en';
    const posts = getAllBlogPosts(locale);
    const localePaths = posts.map(post => ({
      params: { slug: post.slug },
      locale,
    }));
    paths.push(...localePaths);
  }
  return {
    paths,
    fallback: false, // Generate all pages at build time, return 404 for missing pages
  };
}

export async function getStaticProps({ params, locale }) {
  const currentLocale = locale || siteConfig.defaultLanguage || 'en';
  const post = getBlogPostBySlug(params.slug, currentLocale);
  
  // If post not found, return 404
  if (!post) {
    return {
      notFound: true,
    };
  }
    // Get translated slugs for hreflang links
  const translatedSlugs = {};
  const supportedLocales = ['en', 'de', 'fr', 'es', 'pt', 'it'];
  
  for (const lang of supportedLocales) {
    // Get all posts for this language and find the corresponding post
    const allPostsInLang = getAllBlogPosts(lang);
    if (allPostsInLang.length > 0) {
      // For now, we'll map based on the post position/date since we have the same posts in all languages
      // You could enhance this by adding a unique ID field to your posts' frontmatter
      const translatedPost = allPostsInLang.find(p => p.meta.date === post.meta.date) || allPostsInLang[0];
      if (translatedPost) {
        translatedSlugs[lang] = translatedPost.slug;
      }
    }
  }
  
  const content = await markdownToHtml(post.content || '');
  
  // Get related posts for internal linking
  const relatedPosts = getRelatedPosts(post, currentLocale);
  
  // Get translations
  const allTranslations = await getTranslations(currentLocale);
  const commonTranslations = await getTranslations(currentLocale, 'common');
  
  return {
    props: {
      post,
      content,
      allTranslations,
      commonTranslations,
      translatedSlugs,
      relatedPosts,
    },
    // Pure SSG - no revalidation, pages generated only at build time
  };
}
