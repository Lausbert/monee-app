import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Header from '@/components/Header';
import { getAllBlogPosts } from '@/lib/blog';
import { getTranslations } from '@/lib/i18n';
import siteConfig from '@/lib/siteConfig';

export default function BlogPage({ posts, allTranslations, commonTranslations, globalTranslations }) {
    const router = useRouter();
    const { locale } = router;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Add subPageBody class to body element for styling consistency
        document.body.classList.add('subPageBody');
        return () => {
            document.body.classList.remove('subPageBody');
        };    }, []);
    const blogTranslations = allTranslations?.blog || {};
    const title = blogTranslations?.title;
    const subtitle = blogTranslations?.subtitle;
    const readMore = blogTranslations?.read_more;
    const noPosts = blogTranslations?.no_posts;
    
    // Get translated keywords and app name
    const translatedKeywords = blogTranslations?.keywords;
    const translatedAppName = allTranslations?.global?.app_name || siteConfig.app_name;

    const formatDate = (dateString) => {
        if (!mounted) return dateString; // Return raw date during SSR
        return new Date(dateString).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Generate structured data for SEO
    const generateStructuredData = () => {
        const baseUrl = 'https://monee-app.com';
        const blogUrl = `${baseUrl}/${locale !== 'en' ? locale + '/' : ''}blog/`;        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${title} | ${translatedAppName}`,
            description: subtitle,
            url: blogUrl,
            publisher: {
                "@type": "Organization",
                name: translatedAppName,
                logo: {
                    "@type": "ImageObject",
                    url: `${baseUrl}/assets/appicon.webp`,
                },
            },
            mainEntityOfPage: {
                "@type": "WebPage",
                "@id": blogUrl,
            },
        };

        if (posts && posts.length > 0) {
            structuredData.blogPost = posts.map((post) => ({
                "@type": "BlogPosting",
                headline: post.meta.title,
                description: post.meta.excerpt || subtitle,
                url: `${baseUrl}/blog/${post.slug}`,
                datePublished: post.meta.date,
                dateModified: post.meta.date,                author: {
                    "@type": "Person",
                    name: post.meta.author || translatedAppName,
                },
                publisher: {
                    "@type": "Organization",
                    name: translatedAppName,
                    logo: {
                        "@type": "ImageObject",
                        url: `${baseUrl}/assets/appicon.webp`,
                    },
                },
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": `${baseUrl}/blog/${post.slug}`,
                },
            }));
        }
        return JSON.stringify(structuredData);
    };

    return (
        <>            <Head>
                <title>{`${title} | ${translatedAppName}`}</title>
                <meta name="description" content={subtitle} />                
                <meta
                    name="keywords"
                    content={`${translatedAppName}, blog, ${translatedKeywords}`}
                />
                <meta name="author" content={translatedAppName} />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <link rel="shortcut icon" href="/assets/appicon.webp" />

                {/* Essential meta tags for the browser tab */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charSet="utf-8" />
                <meta httpEquiv="Content-Language" content={locale} />                {/* Open Graph for social media */}
                <meta property="og:title" content={`${title} | ${translatedAppName}`} />
                <meta property="og:description" content={subtitle} />
                <meta property="og:image" content="https://monee-app.com/assets/appicon.webp" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={`${translatedAppName} Blog`} />
                <meta property="og:url" content={`https://monee-app.com/${locale !== 'en' ? locale + '/' : ''}blog/`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={translatedAppName} />
                <meta
                    property="og:locale"
                    content={locale === 'en' ? 'en_US' : locale === 'de' ? 'de_DE' : 'fr_FR'}
                />                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${title} | ${translatedAppName}`} />
                <meta name="twitter:description" content={subtitle} />
                <meta name="twitter:image" content="https://monee-app.com/assets/appicon.webp" />
                <meta name="twitter:image:alt" content={`${translatedAppName} Blog`} />

                {/* Canonical URL */}
                <link rel="canonical" href={`https://monee-app.com/${locale !== 'en' ? locale + '/' : ''}blog/`} />

                {/* Language alternates */}
                <link rel="alternate" hreflang="en" href="https://monee-app.com/blog/" />
                <link rel="alternate" hreflang="de" href="https://monee-app.com/de/blog/" />
                <link rel="alternate" hreflang="fr" href="https://monee-app.com/fr/blog/" />
                <link rel="alternate" hreflang="x-default" href="https://monee-app.com/blog/" />

                {/* Structured Data */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateStructuredData() }} />
            </Head>

            {/* Full-width colored header section with navigation */}
            <div className="blog-listing-header-section-fullwidth">
                <div className="container subPageContainer">
                    <Header translations={commonTranslations} />
                    <div className="blog-container">
                        <div className="blog-header">
                            <h1 itemProp="name">{title}</h1>
                            <p itemProp="description">{subtitle}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container subPageContainer">
                <main className="page" role="main">
                    <div className="blog-container" itemScope itemType="https://schema.org/Blog">
                        {/* Blog Posts Grid */}
                        {posts && posts.length > 0 ? (
                            <section className="blog-grid" aria-label="Blog Posts">
                                {posts.map((post, index) => (
                                    <article
                                        key={post.slug}
                                        className="blog-card"
                                        itemScope
                                        itemType="https://schema.org/BlogPosting"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%'
                                        }}
                                    >
                                        <div 
                                            className="blog-card-content"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: '100%',
                                                flex: '1'
                                            }}
                                        >
                                            {/* Author and Date - moved to top with bigger image */}
                                            <div 
                                                className="blog-card-header"
                                                style={{ flexShrink: 0 }}
                                            >
                                                <div className="blog-card-author">
                                                    <Image
                                                        src='/assets/Stephan_Lerner.jpg'
                                                        alt={'Author Stephan Lerner'}
                                                        width={56}
                                                        height={56}
                                                        className="blog-card-author-avatar"
                                                        style={{
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            objectPosition: 'top',
                                                            border: '2px solid rgba(60, 188, 184, 0.2)'
                                                        }}
                                                    />
                                                    <div className="blog-card-author-info">
                                                        {post.meta.author && (
                                                            <p
                                                                className="blog-card-author-name"
                                                                itemProp="author"
                                                                itemScope
                                                                itemType="https://schema.org/Person"
                                                            >
                                                                <span itemProp="name">{post.meta.author}</span>
                                                            </p>
                                                        )}
                                                        <p className="blog-card-date">
                                                            <time dateTime={post.meta.date} itemProp="datePublished">
                                                                {formatDate(post.meta.date)}
                                                            </time>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Title with more spacing */}
                                            <div 
                                                className="blog-card-title-section"
                                                style={{ flexShrink: 0 }}
                                            >
                                                <h2 className="blog-card-title" itemProp="headline">
                                                    <Link href={`/blog/${post.slug}`} itemProp="url">
                                                        {post.meta.title}
                                                    </Link>
                                                </h2>
                                            </div>

                                            {/* Excerpt */}
                                            {post.meta.excerpt && (
                                                <div 
                                                    className="blog-card-excerpt-section"
                                                    style={{ 
                                                        flexGrow: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column'
                                                    }}
                                                >
                                                    <p className="blog-card-excerpt" itemProp="description">
                                                        {post.meta.excerpt}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Read More Link */}
                                            <div 
                                                className="blog-card-footer"
                                                style={{ 
                                                    flexShrink: 0,
                                                    marginTop: 'auto',
                                                    paddingTop: '1rem'
                                                }}
                                            >
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="blog-read-more"
                                                    aria-label={`Read more about ${post.meta.title}`}
                                                    style={{
                                                        backgroundColor: '#3CBCB8',
                                                        color: '#ffffff',
                                                        textDecoration: 'none',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: '1rem 2rem',
                                                        borderRadius: '50px',
                                                        fontWeight: '700',
                                                        fontSize: '1.1rem',
                                                        minWidth: '160px',
                                                        gap: '0.5rem',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        boxShadow: '0 4px 15px rgba(60, 188, 184, 0.3)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        border: '2px solid transparent',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        const button = e.currentTarget;
                                                        const span = button.querySelector('span');
                                                        button.style.backgroundColor = '#2da6a2';
                                                        button.style.transform = 'translateY(-2px) scale(1.02)';
                                                        button.style.boxShadow = '0 8px 25px rgba(60, 188, 184, 0.4)';
                                                        if (span) span.style.backgroundColor = 'transparent';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        const button = e.currentTarget;
                                                        const span = button.querySelector('span');
                                                        button.style.backgroundColor = '#3CBCB8';
                                                        button.style.transform = 'translateY(0) scale(1)';
                                                        button.style.boxShadow = '0 4px 15px rgba(60, 188, 184, 0.3)';
                                                        if (span) span.style.backgroundColor = 'transparent';
                                                    }}
                                                >
                                                    <span style={{ backgroundColor: 'transparent' }}>{readMore}</span>
                                                    <svg 
                                                        width="18" 
                                                        height="18" 
                                                        viewBox="0 0 24 24" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                        style={{ transition: 'transform 0.3s ease' }}
                                                        className="arrow-icon"
                                                    >
                                                        <path d="M5 12h14m-7-7 7 7-7 7"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </section>
                        ) : (
                            /* Empty State */
                            <section className="blog-empty-state" aria-label="No blog posts available">
                                <h2
                                    style={{
                                        fontSize: '2.2rem',
                                        fontWeight: '600',
                                        marginBottom: '1rem',
                                        color: '#333',
                                    }}
                                >
                                    {noPosts}
                                </h2>
                                <p style={{ color: '#666', fontSize: '1.6rem' }}>
                                    Check back soon for new articles and updates!
                                </p>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

export async function getStaticProps({ locale }) {
    try {
        // Get all blog posts for the current locale
        const posts = getAllBlogPosts(locale || 'en');

        // Get translations
        const allTranslations = await getTranslations(locale || 'en');
        const commonTranslations = await getTranslations(locale || 'en', 'common');

        // Structure global translations
        const globalTranslations = {
            ...allTranslations,
            common: commonTranslations || {},
            global: allTranslations?.global || {},
        };

        return {
            props: {
                posts: posts || [],
                allTranslations,
                commonTranslations,
                globalTranslations,
            },
            // Pure SSG - no revalidation, pages generated only at build time
        };
    } catch (error) {
        console.error('Error in getStaticProps for blog:', error);

        return {
            props: {
                posts: [],
                allTranslations: {},
                commonTranslations: {},
                globalTranslations: {},
            },
            // Pure SSG - no revalidation, pages generated only at build time
        };
    }
}