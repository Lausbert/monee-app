import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import siteConfig from './siteConfig'; // Import siteConfig (default export)

// Only import fs on server side
const fs = typeof window === 'undefined' ? require('fs') : null;

const translationsDirectory = path.join(process.cwd(), 'src', 'translations');

/**
 * Loads general translation strings from YAML files.
 * e.g., getTranslations('en', 'global.app_name')
 * e.g., getTranslations('en', 'titles', 'imprint')
 * e.g., getTranslations('en') to get all translations for 'en'
 */
export async function getTranslations(locale, section, key) {
  // Ensure this only runs on server side
  if (typeof window !== 'undefined') {
    console.error('getTranslations should only be called on the server side');
    return key ? `Client-side error: ${section}.${key}` : `Client-side error: ${section}`;
  }

  if (!fs) {
    console.error('File system not available');
    return key ? `FS error: ${section}.${key}` : `FS error: ${section}`;
  }

  try {
    const filePath = path.join(translationsDirectory, `${locale}.yml`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);

    if (!section) return data; // Return all translations for the locale

    let result = data[section];
    if (key && result) {
      result = result[key];
    }
    return result || (key ? `Missing translation: ${section}.${key}` : `Missing section: ${section}`);
  } catch (error) {
    console.error(`Error loading translations for locale ${locale}:`, error);
    return key ? `Error loading: ${section}.${key}` : `Error loading section: ${section}`;
  }
}

/**
 * Loads translated Markdown content.
 * e.g., getMarkdownContent('en', 'imprint')
 */
export async function getMarkdownContent(locale, pageName) {
  // Ensure this only runs on server side
  if (typeof window !== 'undefined') {
    console.error('getMarkdownContent should only be called on the server side');
    return `Client-side error loading content for ${pageName}.`;
  }

  if (!fs) {
    console.error('File system not available');
    return `FS error loading content for ${pageName}.`;
  }

  try {
    const filePath = path.join(translationsDirectory, locale, `${pageName}.md`);
    if (!fs.existsSync(filePath)) {
      // Fallback to default locale if the page doesn't exist for the current locale
      // This might be an oversimplification depending on desired behavior
      const fallbackFilePath = path.join(translationsDirectory, siteConfig.defaultLanguage || siteConfig.default_lang, `${pageName}.md`);
      if(fs.existsSync(fallbackFilePath)) {
        console.warn(`Markdown for '${pageName}' not found for locale '${locale}'. Falling back to default locale.`);
        return fs.readFileSync(fallbackFilePath, 'utf8');
      }
      throw new Error(`Markdown file not found for page: ${pageName} in locale: ${locale} or default locale.`);
    }
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error loading markdown content for locale ${locale}, page ${pageName}:`, error);
    return `Error loading content for ${pageName}.`;
  }
}

// Helper to parse markdown (frontmatter and content)
export function parseMarkdown(markdownContent) {
  const { data, content } = matter(markdownContent);
  // You might want to convert content to HTML here using remark or markdown-to-jsx
  // For now, just returning raw content and frontmatter
  return { frontmatter: data, content };
}
