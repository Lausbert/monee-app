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
        };
    }, []);

    const blogTranslations = allTranslations?.blog || {};
    const title = blogTranslations?.title;
    const subtitle = blogTranslations?.subtitle;
    const readMore = blogTranslations?.read_more;
    const noPosts = blogTranslations?.no_posts;

    const formatDate = (dateString) => {
        if (!mounted) return dateString; // Return raw date during SSR
        return new Date(dateString).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }; return (
        <>
            <Head>
                <title>{`${title} | ${siteConfig.app_name}`}</title>
                <meta name="description" content={subtitle} />
                <link rel="shortcut icon" href="/assets/appicon.webp" />

                {/* Essential meta tags for the browser tab */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charSet="utf-8" />

                {/* Open Graph for social media */}
                <meta property="og:title" content={`${title} | ${siteConfig.app_name}`} />
                <meta property="og:description" content={subtitle} />
                <meta property="og:image" content="https://monee-app.com/assets/appicon.webp" />

                {/* Canonical URL */}
                <link rel="canonical" href={`https://monee-app.com/${locale !== 'en' ? locale + '/' : ''}blog/`} />

                {/* Language alternates */}
                <link rel="alternate" hreflang="en" href="https://monee-app.com/blog/" />
                <link rel="alternate" hreflang="de" href="https://monee-app.com/de/blog/" />
                <link rel="alternate" hreflang="fr" href="https://monee-app.com/fr/blog/" />
                <link rel="alternate" hreflang="x-default" href="https://monee-app.com/blog/" />
            </Head>

            {/* Full-width colored header section with navigation */}
            <div className="blog-listing-header-section-fullwidth">
                <div className="container subPageContainer">
                    <Header translations={commonTranslations} />
                    <div className="blog-container">
                        <div className="blog-header">
                            <h1>{title}</h1>
                            <p>{subtitle}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container subPageContainer">
                <div className="page">

                    <div className="blog-container">
                        {/* Blog Posts Grid */}
                        {posts && posts.length > 0 ? (
                            <div className="blog-grid">
                                {posts.map((post, index) => (
                                    <article key={post.slug} className="blog-card">
                                        <div className="blog-card-content">
                                            {/* Author and Date */}
                                            <div className="blog-card-footer">
                                                <div className="blog-card-author">
                                                    {post.meta.authorImage && (
                                                        <div className="blog-card-author-avatar">
                                                            <Image
                                                                src={post.meta.authorImage}
                                                                alt={post.meta.author || 'Author'}
                                                                width={32}
                                                                height={32}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="blog-card-author-info">
                                                        {post.meta.author && (
                                                            <p className="blog-card-author-name">{post.meta.author}</p>
                                                        )}
                                                        <p className="blog-card-date">
                                                            {formatDate(post.meta.date)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h2 className="blog-card-title">
                                                <Link href={`/blog/${post.slug}`}>
                                                    {post.meta.title}
                                                </Link>
                                            </h2>

                                            {/* Excerpt */}
                                            {post.meta.excerpt && (
                                                <p className="blog-card-excerpt">
                                                    {post.meta.excerpt}
                                                </p>
                                            )}
                                            {/* Read More Link */}
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="blog-read-more"
                                                style={{
                                                    backgroundColor: '#3CBCB8',
                                                    color: '#ffffff',
                                                    textDecoration: 'none',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {readMore} →
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>) : (
                            /* Empty State */
                            <div className="blog-empty-state">
                                <h3 style={{ fontSize: '2.2rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                                    {noPosts}
                                </h3>
                                <p style={{ color: '#666', fontSize: '1.6rem' }}>
                                    Check back soon for new articles and updates!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
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
            global: allTranslations?.global || {}
        };

        return {
            props: {
                posts: posts || [],
                allTranslations,
                commonTranslations,
                globalTranslations
            },
            revalidate: 60 // Revalidate every minute
        };
    } catch (error) {
        console.error('Error in getStaticProps for blog:', error);

        return {
            props: {
                posts: [],
                allTranslations: {},
                commonTranslations: {},
                globalTranslations: {}
            },
            revalidate: 60
        };
    }
}