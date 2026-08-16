import siteConfig from './siteConfig';
import { getTranslations } from './i18n';

const appStoreDataCache = new Map();

/**
 * Fetches App Store data for the app during build time (SSG)
 * @param {string} locale - The current locale to determine the country code
 * @returns {Promise<Object>} App Store data including trackViewUrl, trackName, etc.
 */
export async function fetchAppStoreData(locale = 'en') {
  const cacheKey = locale || 'en';
  if (!appStoreDataCache.has(cacheKey)) {
    appStoreDataCache.set(cacheKey, loadAppStoreData(cacheKey));
  }

  return appStoreDataCache.get(cacheKey);
}

async function loadAppStoreData(locale) {
  if (!siteConfig.ios_app_id) {
    console.warn('No iOS app ID configured in siteConfig');
    return null;
  }

  try {
    // Get country code from translations or fallback to defaults
    let iosAppCountry = 'us'; // Default country
    try {
      const translations = await getTranslations(locale);
      iosAppCountry = translations?.global?.ios_app_country || siteConfig.defaultLanguage || siteConfig.default_lang || 'us';
    } catch (e) {
      console.warn('Could not load translations for App Store country code, using default.');
    }

    // Build the iTunes API URL
    const apiUrl = `https://itunes.apple.com/lookup?id=${siteConfig.ios_app_id}&country=${iosAppCountry}`;

    // console.log(`Fetching App Store data from: ${apiUrl}`);

    // Fetch data from iTunes API
    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(10_000) });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const appInfo = data.results[0];
      /*console.log('App Store data fetched successfully:', {
        trackName: appInfo.trackName,
        trackViewUrl: appInfo.trackViewUrl,
        country: iosAppCountry
      });*/
      
      return {
        trackViewUrl: appInfo.trackViewUrl,
        trackName: appInfo.trackName,
        artworkUrl60: appInfo.artworkUrl60,
        artworkUrl100: appInfo.artworkUrl100,
        artworkUrl512: appInfo.artworkUrl512,
        averageUserRating: appInfo.averageUserRating,
        userRatingCount: appInfo.userRatingCount,
        formattedPrice: appInfo.formattedPrice,
        country: iosAppCountry
      };
    } else {
      console.warn('No results from Apple API for ID:', siteConfig.ios_app_id);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch App Store data:', error);
    return null;
  }
}

/**
 * Gets the App Store link, either from fetched data or fallback to siteConfig
 * @param {Object} appStoreData - Data fetched from iTunes API
 * @returns {string} App Store URL
 */
export function getAppStoreLink(appStoreData) {
  return appStoreData?.trackViewUrl || siteConfig.appstore_link;
}
