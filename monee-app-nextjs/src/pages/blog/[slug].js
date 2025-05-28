import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { getBlogPostBySlug, getAllBlogPosts, markdownToHtml } from '@/lib/blog';
import { getTranslations } from '@/lib/i18n';
import siteConfig from '@/lib/siteConfig';

export default function BlogPost({ post, content, allTranslations, commonTranslations, globalTranslations }) {
  const router = useRouter();
  const { locale } = router;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Add subPageBody class to body element for styling
    document.body.classList.add('subPageBody');
    return () => {
      document.body.classList.remove('subPageBody');
    };
  }, []);
  // If the page is not yet generated, this will be displayed initially
  if (router.isFallback) {
    return (
      <>
        <Head>
          <title>Loading... | {siteConfig.app_name}</title>
          <meta name="description" content="Loading blog post..." />
          <link rel="shortcut icon" href="/assets/appicon.webp" />
        </Head>

        <div className="headerBackground subPageHeaderBackground">
          <div className="container subPageContainer">
            <Header translations={commonTranslations} />
            <div className="page">
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Head>
          <title>Post Not Found | {siteConfig.app_name}</title>
          <meta name="description" content="The blog post you are looking for does not exist." />
          <link rel="shortcut icon" href="/assets/appicon.webp" />
        </Head>

        <div className="headerBackground subPageHeaderBackground">
          <div className="container subPageContainer">
            <Header translations={commonTranslations} />
            <div className="page">
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Post Not Found</h1>
                <p style={{ marginBottom: '2rem', color: '#666' }}>
                  The post you are looking for does not exist or has been moved.
                </p>
                <Link
                  href="/blog"
                  style={{
                    backgroundColor: '#3CBCB8',
                    color: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  {allTranslations?.blog?.back_to_blog || 'Back to Blog'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  const blogTranslations = allTranslations?.blog || {};
  const title = post.meta.title;
  const description = post.meta.excerpt;
  const formattedDate = mounted ? new Date(post.meta.date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : post.meta.date;

  return (
    <>
      <Head>
        <title>{`${title} | ${blogTranslations?.title || 'Blog'} | ${siteConfig.app_name}`}</title>
        <meta name="description" content={description} />
        <link rel="shortcut icon" href="/assets/appicon.webp" />

        {/* Essential meta tags for the browser tab */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />

        {/* Open Graph for social media */}
        <meta property="og:title" content={`${title} | ${siteConfig.app_name}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={post.meta.featuredImage || "https://monee-app.com/assets/appicon.webp"} />

        {/* Canonical URL */}
        <link rel="canonical" href={`https://monee-app.com/${locale !== 'en' ? locale + '/' : ''}blog/${post.slug}/`} />

        {/* Language alternates */}
        <link rel="alternate" hreflang="en" href={`https://monee-app.com/blog/${post.slug}/`} />
        <link rel="alternate" hreflang="de" href={`https://monee-app.com/de/blog/${post.slug}/`} />
        <link rel="alternate" hreflang="fr" href={`https://monee-app.com/fr/blog/${post.slug}/`} />
        <link rel="alternate" hreflang="x-default" href={`https://monee-app.com/blog/${post.slug}/`} />
      </Head>

      {/* Colored header section with navigation */}
      <div className="blog-single-header-section">
        <div className="container subPageContainer">
          <Header translations={commonTranslations} />
          <div className="blog-single-container">
            <div className="blog-single-back-link">
              <Link href="/blog">
                {blogTranslations.back_to_blog || 'Back to Blog'}
              </Link>
            </div>

            {/* Title and meta in colored section */}
            <div className="blog-single-header-content">
              <h1 className="blog-single-title-header">
                {post.meta.title}
              </h1>

              <div className="blog-single-meta-header">
                <div className="blog-single-author">
                  {post.meta.authorImage && (
                    <div className="blog-single-author-avatar">
                      <Image
                        src={post.meta.authorImage}
                        alt={post.meta.author || 'Author'}
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%' }}
                      />
                    </div>
                  )}
                  <div className="blog-single-author-info">
                    {post.meta.author && (
                      <p className="blog-single-author-name">{post.meta.author}</p>
                    )}
                    <p className="blog-single-date">
                      {blogTranslations.published_on || 'Published on'} {formattedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container subPageContainer">
        <div className="page">
          <div className="blog-single-container">
            <article className="blog-single-article">
              <div className="blog-single-content">
                {/* Featured image moved to content area */}
                {post.meta.featuredImage && (
                  <div className="blog-single-featured-image">
                    <Image
                      src={post.meta.featuredImage}
                      alt={post.meta.title}
                      width={800}
                      height={400}
                      style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
                    />
                  </div>
                )}

                <div
                  className="blog-single-body markdown-body"
                  dangerouslySetInnerHTML={{ __html: content }}
                />                {post.meta.authorBio && (
                  <div className="blog-single-author-bio">
                    <div className="author-bio-header">
                      <h3>About the Author</h3>
                    </div>
                    <div className="author-bio-content">
                      <div className="author-bio-avatar">                        <Image
                          src={post.meta.authorImage || '/assets/authors/monee-team.webp'}
                          alt={post.meta.author || 'Author'}
                          width={80}
                          height={80}
                          style={{ borderRadius: '50%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="author-bio-text">
                        <h4 className="author-bio-name">{post.meta.author}</h4>
                        <p className="author-bio-description">{post.meta.authorBio}</p>
                        {post.meta.authorLinkedIn && (
                          <div className="author-bio-social">
                            <a 
                              href={post.meta.authorLinkedIn} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="author-linkedin-link"
                            >
                              <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="currentColor"
                                className="linkedin-icon"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              Connect on LinkedIn
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
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
        locale
      }));
      paths.push(...localePaths);
    }
  } else {
    // Fallback for when locales aren't available
    const locale = siteConfig.defaultLanguage || 'en';
    const posts = getAllBlogPosts(locale);
    const localePaths = posts.map(post => ({
      params: { slug: post.slug },
      locale
    }));
    paths.push(...localePaths);
  }

  return {
    paths,
    fallback: true, // Show a fallback version while loading
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

  const content = await markdownToHtml(post.content || '');

  // Get translations
  const allTranslations = await getTranslations(currentLocale);
  const commonTranslations = await getTranslations(currentLocale, "common");

  // Structure translations for global context
  const globalTranslations = {
    ...allTranslations,
    common: commonTranslations || {},
    global: allTranslations?.global || {}
  };

  return {
    props: {
      post,
      content,
      allTranslations,
      commonTranslations,
      globalTranslations,
    },
    // Revalidate content every hour
    revalidate: 3600,
  };
}
