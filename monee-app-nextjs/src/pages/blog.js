import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Header from '@/components/Header';
import { getAllBlogPosts } from '@/lib/blog';
import { getTranslations } from '@/lib/i18n';
import siteConfig from '@/lib/siteConfig';

export default function BlogPage({ posts, allTranslations }) {
    const router = useRouter();
    const { locale } = router;

    const blogTranslations = allTranslations?.blog || {};
    const title = blogTranslations?.title;
    const subtitle = blogTranslations?.subtitle;
    const readMore = blogTranslations?.read_more;
    const noPosts = blogTranslations?.no_posts;
    
    // Get translated keywords and app name
    const translatedKeywords = blogTranslations?.keywords;
    const translatedAppName = allTranslations?.global?.app_name || siteConfig.app_name;

    const formatDate = (dateString) => {
        const localeMap = {
            'en': 'en-US',
            'de': 'de-DE',
            'fr': 'fr-FR'
        };
        return new Date(dateString).toLocaleDateString(localeMap[locale] || 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Generate structured data for SEO
    const generateStructuredData = () => {
        const baseUrl = 'https://monee-app.com';
        const blogUrl = `${baseUrl}/${locale !== 'en' ? locale + '/' : ''}blog`;        
        const structuredData = {
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
                dateModified: post.meta.date,                
                author: {
                    "@type": "Person",
                    name: post.meta.author,
                },
                publisher: {
                    "@type": "Person",
                    name: post.meta.author,
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
        <>            
            <Head>
                <title>{`${title} | ${translatedAppName}`}</title>
                <meta name="description" content={subtitle} />                
                <meta
                    name="keywords"
                    content={`${translatedAppName}, ${translatedKeywords}`}
                />
                <meta name="author" content={translatedAppName} />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <link rel="shortcut icon" href="/assets/appicon.webp" />

                {/* Essential meta tags for the browser tab */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charSet="utf-8" />
                <meta httpEquiv="Content-Language" content={locale} />                
                
                {/* Open Graph for social media */}
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
                />                

                {/* Twitter Cards */}
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
                <link rel="alternate" hreflang="es" href="https://monee-app.com/es/blog/" />
                <link rel="alternate" hreflang="pt" href="https://monee-app.com/pt/blog/" />
                <link rel="alternate" hreflang="x-default" href="https://monee-app.com/blog/" />

                {/* Override base.scss styles for blog read more button */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .blog-read-more,
                        .blog-read-more:link,
                        .blog-read-more:hover,
                        .blog-read-more:visited,
                        .blog-read-more:active,
                        .blog-read-more:focus {
                            color: #ffffff !important;
                            text-decoration: none !important;
                            background-color: #14b8a6 !important;
                            border: 2px solid transparent !important;
                            box-sizing: border-box !important;
                        }
                        .blog-read-more:hover {
                            background-color: #0d9488 !important;
                            color: #ffffff !important;
                        }
                        .blog-read-more span,
                        .blog-read-more svg {
                            color: #ffffff !important;
                        }
                    `
                }} />

                {/* Structured Data */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateStructuredData() }} />
            </Head>

            {/* Full-width colored header section with navigation */}
            <div className="blog-listing-header-section-fullwidth">
                <div className="container subPageContainer">
                    <Header translations={allTranslations} />
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
                                        className="blog-card flex flex-col h-full"
                                        itemScope
                                        itemType="https://schema.org/BlogPosting"
                                    >
                                        <div className="blog-card-content flex flex-col h-full flex-1">
                                            {/* Author and Date - moved to top with bigger image */}
                                            <div className="blog-card-header flex-shrink-0">
                                                <div className="blog-card-author">
                                                    <Image
                                                        src='/assets/Stephan_Lerner.jpg'
                                                        alt={'Author Stephan Lerner'}
                                                        width={56}
                                                        height={56}
                                                        className="blog-card-author-avatar rounded-full object-cover object-top border-2 border-teal-400/20"
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
                                            <div className="blog-card-title-section flex-shrink-0">
                                                <h2 className="blog-card-title" itemProp="headline">
                                                    <Link href={`/blog/${post.slug}`} itemProp="url">
                                                        {post.meta.title}
                                                    </Link>
                                                </h2>
                                            </div>

                                            {/* Excerpt */}
                                            {post.meta.excerpt && (
                                                <div className="blog-card-excerpt-section flex-grow flex flex-col">
                                                    <p className="blog-card-excerpt" itemProp="description">
                                                        {post.meta.excerpt}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Read More Link */}
                                            <div className="blog-card-footer flex-shrink-0 mt-auto pt-4">
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="blog-read-more bg-teal-500 hover:bg-teal-600 text-white no-underline inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-lg min-w-[160px] gap-3 transition-all duration-300 ease-out shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 uppercase tracking-wide border-2 border-transparent hover:-translate-y-0.5 hover:scale-105"
                                                    aria-label={`Read more about ${post.meta.title}`}
                                                    style={{
                                                        color: '#ffffff',
                                                        backgroundColor: '#14b8a6',
                                                        textDecoration: 'none',
                                                        alignItems: 'center',
                                                        display: 'inline-flex'
                                                    }}
                                                >
                                                    <span style={{ 
                                                        color: '#ffffff',
                                                        lineHeight: '1.2'
                                                    }}>{readMore}</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </section>
                        ) : (
                            /* Empty State */
                            <section className="blog-empty-state" aria-label="No blog posts available">
                                <h2 className="text-4xl font-semibold mb-4 text-gray-800">
                                    {noPosts}
                                </h2>
                                <p className="text-gray-600 text-xl">
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
    // Get all blog posts for the current locale
    const posts = getAllBlogPosts(locale || 'en');

    // Get translations
    const allTranslations = await getTranslations(locale || 'en');

    // Structure global translations
    const globalTranslations = {
        ...allTranslations,
        global: allTranslations?.global || {},
    };

    return {
        props: {
            posts: posts || [],
            allTranslations,
            globalTranslations,
        },
    };
}