const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Import site configuration
const siteConfig = {
  site_url: "https://monee-app.com",
  defaultLanguage: "en",
  languages: ["en", "de", "fr"]
};

// Helper function to convert title to URL-friendly slug (matching blog.js logic)
function titleToSlug(title) {
  return title
    .toLowerCase()
    // Replace accented characters with their non-accented equivalents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace common special characters
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[ß]/g, 'ss')
    .replace(/[æ]/g, 'ae')
    .replace(/[œ]/g, 'oe')
    // Remove remaining special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate sitemap XML for the website
 * Includes all static pages and blog posts for all languages
 */
function generateSitemap() {
  const baseUrl = siteConfig.site_url;
  const languages = siteConfig.languages || ['en', 'de', 'fr'];
  const defaultLanguage = siteConfig.defaultLanguage || 'en';
  
  // First, collect all blog posts from all languages to find the newest date
  const allBlogPosts = {};
  let newestBlogDate = '2000-01-01'; // Initialize with very old date so any real post date will be newer
  
  languages.forEach(lang => {
    allBlogPosts[lang] = getBlogPosts(lang);
    // Find the newest date from this language's posts
    allBlogPosts[lang].forEach(post => {
      if (post.lastmod > newestBlogDate) {
        newestBlogDate = post.lastmod;
      }
    });
  });
  
  // If no blog posts found, use current date as fallback
  if (newestBlogDate === '2000-01-01') {
    newestBlogDate = "ERROR";
  }

  // Static pages that exist for all languages
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'monthly', lastmod: '2025-06-28' }, // Homepage
    { path: 'blog', priority: '0.8', changefreq: 'weekly', lastmod: newestBlogDate }, // Blog uses newest post date
    { path: 'android', priority: '0.2', changefreq: 'monthly', lastmod: '2025-06-28' },
    { path: 'privacy', priority: '0.1', changefreq: 'yearly', lastmod: '2025-06-28' },
    { path: 'imprint', priority: '0.1', changefreq: 'yearly', lastmod: '2025-06-28' }
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
    <loc>${url}/</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
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
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}/"/>`;
        }
      });

      sitemap += `
  </url>
`;
    });
  });

  // Add blog posts for each language
  // Process each language's blog posts
  languages.forEach(language => {
    const blogPosts = allBlogPosts[language];
    
    blogPosts.forEach(post => {
      const isDefault = language === defaultLanguage;
      const url = isDefault 
        ? `${baseUrl}/blog/${post.slug}` 
        : `${baseUrl}/${language}/blog/${post.slug}`;

      sitemap += `  <url>
    <loc>${url}/</loc>
    <lastmod>${post.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;

      // Add alternate language links for blog posts
      // Match posts by filename (post1.md -> post1.md in other languages)
      languages.forEach(altLang => {
        if (altLang !== language) {
          const altPosts = allBlogPosts[altLang];
          // Find corresponding post by filename
          const altPost = altPosts.find(p => p.filename === post.filename);
          
          if (altPost) {
            const isAltDefault = altLang === defaultLanguage;
            const altUrl = isAltDefault 
              ? `${baseUrl}/blog/${altPost.slug}` 
              : `${baseUrl}/${altLang}/blog/${altPost.slug}`;
            
            sitemap += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}/"/>`;
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
      
      // Only include posts with titles (matching blog.js logic)
      if (!data.title) {
        return null;
      }
      
      // Generate slug from title (matching blog.js logic)
      const titleSlug = titleToSlug(data.title);
      
      return {
        slug: titleSlug,
        filename: name, // Keep original filename for cross-language matching
        lastmod: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        title: data.title,
        ...data
      };
    })
    .filter(Boolean); // Remove null entries

  return posts;
}

/**
 * Generate sitemap.xml file during build process
 */
function generateSitemapFile() {
  try {
    console.log('🚀 Generating static sitemap for SSG...');
    
    const sitemap = generateSitemap();
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    fs.writeFileSync(sitemapPath, sitemap);
    
    console.log('✅ Static sitemap generated successfully at public/sitemap.xml');
    console.log('🌐 Will be available at: https://monee-app.com/sitemap.xml');
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemapFile();
