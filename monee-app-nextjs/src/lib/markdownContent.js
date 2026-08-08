import fs from 'fs';
import path from 'path';
import siteConfig from './siteConfig';
import { parseFrontmatter } from './frontmatter';

function readMarkdownContentFile(locale, pageName) {
  try {
    switch (`${locale}:${pageName}`) {
      case 'en:delete':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'en', 'delete.md'), 'utf8');
      case 'en:imprint':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'en', 'imprint.md'), 'utf8');
      case 'en:invite':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'en', 'invite.md'), 'utf8');
      case 'en:privacy':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'en', 'privacy.md'), 'utf8');
      case 'de:delete':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'de', 'delete.md'), 'utf8');
      case 'de:imprint':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'de', 'imprint.md'), 'utf8');
      case 'de:invite':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'de', 'invite.md'), 'utf8');
      case 'de:privacy':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'de', 'privacy.md'), 'utf8');
      case 'fr:delete':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'fr', 'delete.md'), 'utf8');
      case 'fr:imprint':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'fr', 'imprint.md'), 'utf8');
      case 'fr:invite':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'fr', 'invite.md'), 'utf8');
      case 'fr:privacy':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'fr', 'privacy.md'), 'utf8');
      case 'es:delete':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'es', 'delete.md'), 'utf8');
      case 'es:imprint':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'es', 'imprint.md'), 'utf8');
      case 'es:invite':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'es', 'invite.md'), 'utf8');
      case 'es:privacy':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'es', 'privacy.md'), 'utf8');
      case 'pt:delete':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'pt', 'delete.md'), 'utf8');
      case 'pt:imprint':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'pt', 'imprint.md'), 'utf8');
      case 'pt:invite':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'pt', 'invite.md'), 'utf8');
      case 'pt:privacy':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'pt', 'privacy.md'), 'utf8');
      case 'it:delete':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'it', 'delete.md'), 'utf8');
      case 'it:imprint':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'it', 'imprint.md'), 'utf8');
      case 'it:invite':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'it', 'invite.md'), 'utf8');
      case 'it:privacy':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'it', 'privacy.md'), 'utf8');
      case 'ru:delete':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'ru', 'delete.md'), 'utf8');
      case 'ru:imprint':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'ru', 'imprint.md'), 'utf8');
      case 'ru:invite':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'ru', 'invite.md'), 'utf8');
      case 'ru:privacy':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'ru', 'privacy.md'), 'utf8');
      case 'hi:delete':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'hi', 'delete.md'), 'utf8');
      case 'hi:imprint':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'hi', 'imprint.md'), 'utf8');
      case 'hi:invite':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'hi', 'invite.md'), 'utf8');
      case 'hi:privacy':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'hi', 'privacy.md'), 'utf8');
      case 'el:delete':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'el', 'delete.md'), 'utf8');
      case 'el:imprint':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'el', 'imprint.md'), 'utf8');
      case 'el:invite':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'el', 'invite.md'), 'utf8');
      case 'el:privacy':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'el', 'privacy.md'), 'utf8');
      case 'tr:delete':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'tr', 'delete.md'), 'utf8');
      case 'tr:imprint':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'tr', 'imprint.md'), 'utf8');
      case 'tr:invite':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'tr', 'invite.md'), 'utf8');
      case 'tr:privacy':
        return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'tr', 'privacy.md'), 'utf8');
      default:
        return null;
    }
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

export async function getMarkdownContent(locale, pageName) {
  try {
    const markdownContent = readMarkdownContentFile(locale, pageName);
    if (!markdownContent) {
      const fallbackMarkdownContent = readMarkdownContentFile(siteConfig.defaultLanguage || siteConfig.default_lang, pageName);
      if (fallbackMarkdownContent) {
        console.warn(`Markdown for '${pageName}' not found for locale '${locale}'. Falling back to default locale.`);
        return fallbackMarkdownContent;
      }
      throw new Error(`Markdown file not found for page: ${pageName} in locale: ${locale} or default locale.`);
    }
    return markdownContent;
  } catch (error) {
    console.error(`Error loading markdown content for locale ${locale}, page ${pageName}:`, error);
    return `Error loading content for ${pageName}.`;
  }
}

export function parseMarkdown(markdownContent) {
  const { data, content } = parseFrontmatter(markdownContent);
  return { frontmatter: data, content };
}
