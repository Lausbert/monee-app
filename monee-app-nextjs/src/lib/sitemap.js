import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import siteConfig from './siteConfig.js';

/**
 * Generate sitemap XML for the website
 * Includes all static pages and blog posts for all languages
 */
export function generateSitemap() {
  const baseUrl = siteConfig.site_url;
  const languages = siteConfig.languages || ['en', 'de', 'fr'];
  const defaultLanguage = siteConfig.defaultLanguage || 'en';
  
  // Static pages that exist for all languages
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'monthly' }, // Homepage
    { path: 'blog', priority: '0.8', changefreq: 'weekly' },
    { path: 'android', priority: '0.7', changefreq: 'monthly' },
    { path: 'invite', priority: '0.6', changefreq: 'monthly' },
    { path: 'privacy', priority: '0.5', changefreq: 'yearly' },
    { path: 'imprint', priority: '0.3', changefreq: 'yearly' }
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Add static pages for each language
  languages.forEach(language => {
    staticPages.forEach(page => {
      const isDefault = language === defaultLanguage;
      const url = isDefault && page.path === '' 
        ? baseUrl 
        : isDefault 
          ? `${baseUrl}/${page.path}` 
          : page.path === ''
            ? `${baseUrl}/${language}`
            : `${baseUrl}/${language}/${page.path}`;

      sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;

      // Add alternate language links
      languages.forEach(altLang => {
        if (altLang !== language) {
          const isAltDefault = altLang === defaultLanguage;
          const altUrl = isAltDefault && page.path === '' 
            ? baseUrl 
            : isAltDefault 
              ? `${baseUrl}/${page.path}` 
              : page.path === ''
                ? `${baseUrl}/${altLang}`
                : `${baseUrl}/${altLang}/${page.path}`;
          
          sitemap += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}"/>`;
        }
      });

      sitemap += `
  </url>
`;
    });
  });

  // Add blog posts for each language
  languages.forEach(language => {
    const blogPosts = getBlogPosts(language);
    
    blogPosts.forEach(post => {
      const isDefault = language === defaultLanguage;
      const url = isDefault 
        ? `${baseUrl}/blog/${post.slug}` 
        : `${baseUrl}/${language}/blog/${post.slug}`;

      sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;

      // Add alternate language links for blog posts
      languages.forEach(altLang => {
        if (altLang !== language) {
          // Check if the post exists in the alternate language
          const altPosts = getBlogPosts(altLang);
          const altPost = altPosts.find(p => p.slug === post.slug);
          
          if (altPost) {
            const isAltDefault = altLang === defaultLanguage;
            const altUrl = isAltDefault 
              ? `${baseUrl}/blog/${altPost.slug}` 
              : `${baseUrl}/${altLang}/blog/${altPost.slug}`;
            
            sitemap += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}"/>`;
          }
        }
      });

      sitemap += `
  </url>
`;
    });
  });

  sitemap += `</urlset>`;
  return sitemap;
}

/**
 * Get all blog posts for a specific language
 */
function getBlogPosts(language) {
  const postsDirectory = path.join(process.cwd(), 'src', 'translations', language, '_posts');
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const filePath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug: name.replace(/\.md$/, ''),
        lastmod: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        ...data
      };
    });

  return posts;
}

/**
 * Get all available blog post slugs across all languages
 */
export function getAllBlogSlugs() {
  const languages = siteConfig.languages || ['en', 'de', 'fr'];
  const allSlugs = new Set();
  
  languages.forEach(language => {
    const posts = getBlogPosts(language);
    posts.forEach(post => {
      allSlugs.add(post.slug);
    });
  });
  
  return Array.from(allSlugs);
}
