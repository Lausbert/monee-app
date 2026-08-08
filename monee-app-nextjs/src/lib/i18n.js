import path from 'path';
import yaml from 'js-yaml';

// Only import fs on server side
const fs = typeof window === 'undefined' ? require('fs') : null;

function readTranslationFile(locale) {
  switch (locale) {
    case 'en':
      return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'en.yml'), 'utf8');
    case 'de':
      return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'de.yml'), 'utf8');
    case 'fr':
      return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'fr.yml'), 'utf8');
    case 'es':
      return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'es.yml'), 'utf8');
    case 'pt':
      return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'pt.yml'), 'utf8');
    case 'it':
      return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'it.yml'), 'utf8');
    case 'ru':
      return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'ru.yml'), 'utf8');
    case 'hi':
      return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'hi.yml'), 'utf8');
    case 'el':
      return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'el.yml'), 'utf8');
    case 'tr':
      return fs.readFileSync(path.join(process.cwd(), 'src', 'translations', 'tr.yml'), 'utf8');
    default:
      return null;
  }
}

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
    const fileContents = readTranslationFile(locale);
    if (!fileContents) {
      throw new Error(`Unsupported locale: ${locale}`);
    }
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
