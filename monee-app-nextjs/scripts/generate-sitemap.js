const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Import site configuration
const siteConfig = {
  site_url: "https://monee-app.com",
  defaultLanguage: "en",
  languages: ["en", "de", "fr", "es", "pt", "it", "ru", "hi", "el", "tr"],
  blogEnabledLocales: ["en", "de", "fr", "es", "pt", "it", "ru", "hi"],
};

// Translations root to read cross-locale files when needed
const translationsRoot = path.join(process.cwd(), 'src', 'translations');

// Helper function to convert title to URL-friendly slug (matching blog.js logic)
function titleToSlug(title) {
  const cyrillicMap = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'
  };
  return title
    .toLowerCase()
    // Transliterate Cyrillic to Latin
    .replace(/[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]/g, (c) => cyrillicMap[c] || '')
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

// Helper: get English slug for a given postId (e.g., "post16")
function getEnglishSlugForPostId(postId) {
  try {
    const englishPath = path.join(translationsRoot, 'en', '_posts', `${postId}.md`);
    if (!fs.existsSync(englishPath)) return null;
    const englishContents = fs.readFileSync(englishPath, 'utf8');
    const { data } = matter(englishContents);
    const primary = data.slug ? String(data.slug).toLowerCase() : (data.title ? titleToSlug(data.title) : null);
    return primary && primary.length > 0 ? primary : postId;
  } catch (_) {
    return null;
  }
}

/**
 * Generate sitemap XML for the website
 * Includes all static pages and blog posts for all languages
 */
function generateSitemap() {
  const baseUrl = siteConfig.site_url;
  const languages = siteConfig.languages || ['en', 'de', 'fr', 'es', 'pt', 'it', 'ru', 'hi'];
  const blogEnabledLocales = siteConfig.blogEnabledLocales || languages;
  const defaultLanguage = siteConfig.defaultLanguage || 'en';
  
  // First, collect all blog posts from all languages to find the newest date
  const allBlogPosts = {};
  let newestBlogDate = '2000-01-01'; // Initialize with very old date so any real post date will be newer
  
  languages.forEach(lang => {
    if (blogEnabledLocales.includes(lang)) {
      allBlogPosts[lang] = getBlogPosts(lang);
    } else {
      allBlogPosts[lang] = [];
    }
  });

  blogEnabledLocales.forEach(lang => {
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
    { path: '', priority: '1.0', changefreq: 'monthly', lastmod: '2025-10-22' }, // Homepage
    { path: 'blog', priority: '0.8', changefreq: 'daily', lastmod: newestBlogDate }, // Blog uses newest post date
    { path: 'privacy', priority: '0.1', changefreq: 'yearly', lastmod: '2025-12-11' },
    { path: 'imprint', priority: '0.1', changefreq: 'yearly', lastmod: '2025-10-22' }
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Add static pages for each language
  languages.forEach(language => {
    staticPages.forEach(page => {
      if (page.path === 'blog' && !blogEnabledLocales.includes(language)) {
        return;
      }

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
          if (page.path === 'blog' && !blogEnabledLocales.includes(altLang)) {
            return;
          }
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
  blogEnabledLocales.forEach(language => {
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
    <priority>0.9</priority>`;

      // Add alternate language links for blog posts
      // Match posts by filename (post1.md -> post1.md in other languages)
      blogEnabledLocales.forEach(altLang => {
        if (altLang !== language) {
          const altPosts = allBlogPosts[altLang] || [];
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
      const postId = path.parse(name).name; // e.g., 'post16'
      // Load shared blog meta (date, author, etc.)
      let sharedMeta = {};
      try {
        const metaPath = path.join(process.cwd(), 'src', 'blog-meta', `${postId}.json`);
        if (fs.existsSync(metaPath)) {
          const raw = fs.readFileSync(metaPath, 'utf8');
          sharedMeta = JSON.parse(raw);
        }
      } catch (_) {
        // ignore malformed meta; fall back to frontmatter only
      }
      
      // Only include posts that have either slug or title (matching blog.js logic)
      if (!data.title && !data.slug) {
        return null;
      }
      
      // Generate slug (prefer frontmatter slug, fallback to title); ensure non-empty by falling back to postId
      const primarySlug = data.slug ? String(data.slug).toLowerCase() : titleToSlug(data.title);
      let titleSlug = primarySlug && primarySlug.length > 0 ? primarySlug : postId;
      // For Hindi posts >= 11, mirror app logic: use English slug for readability and consistency
      if (language === 'hi') {
        const match = postId.match(/^post(\d+)$/i);
        const index = match ? parseInt(match[1], 10) : NaN;
        if (!Number.isNaN(index) && index >= 11) {
          const enSlug = getEnglishSlugForPostId(postId);
          if (enSlug) titleSlug = enSlug;
        }
      }
      
      // Determine lastmod: prefer modified, then date, from shared meta first, then frontmatter
      const rawLastmod = sharedMeta.modified || sharedMeta.date || data.modified || data.date;
      const lastmod = rawLastmod ? new Date(rawLastmod).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

      return {
        slug: titleSlug,
        filename: name, // Keep original filename for cross-language matching
        lastmod,
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
