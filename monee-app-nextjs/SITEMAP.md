# Sitemap Generation

This project automatically generates static XML sitemaps for SEO optimization.

## Features

- **Static Site Generation (SSG)**: Sitemaps are generated as static files during build time
- **Multi-language Support**: Includes all pages for EN, DE, and FR locales with proper hreflang attributes
- **Blog Posts**: Automatically discovers and includes all blog posts from all languages
- **SEO Optimized**: Includes proper priorities, change frequencies, and last modification dates

## Generated Files

- `public/sitemap.xml` - Main sitemap with all pages and blog posts
- `public/sitemap-index.xml` - Sitemap index (for future expansion)
- `public/robots.txt` - Updated to reference the sitemap

## Usage

### Automatic Generation (Recommended)
The sitemap is automatically generated during the build process:

```bash
npm run build
```

### Manual Generation
To generate the sitemap manually:

```bash
npm run generate-sitemap
```

## Configuration

The sitemap configuration is embedded in `scripts/generate-sitemap.js`:

- **Base URL**: `https://monee-app.com`
- **Languages**: `['en', 'de', 'fr']`
- **Default Language**: `en`

## Included Pages

### Static Pages (all languages)
- Homepage (`/`)
- Blog (`/blog`)
- Android (`/android`)
- Invite (`/invite`)
- Privacy (`/privacy`)
- Imprint (`/imprint`)

### Dynamic Pages
- Blog posts from `src/translations/{lang}/_posts/*.md`

## SEO Benefits

1. **Search Engine Discovery**: Helps search engines find all your pages
2. **Multi-language SEO**: Proper hreflang implementation for international SEO
3. **Content Prioritization**: Different priorities for different page types
4. **Fresh Content Detection**: Last modification dates for better crawling

## Accessing the Sitemap

Once deployed, your sitemap will be available at:
- https://monee-app.com/sitemap.xml
- https://monee-app.com/sitemap-index.xml
