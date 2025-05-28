import { useEffect } from 'react';
import { useRouter } from 'next/router';
import siteConfig from '../lib/siteConfig';
import { getTranslations } from '../lib/i18n'; // Assuming you might need translations for country code

export default function AppStoreImages() {
  const router = useRouter();
  const { locale, defaultLocale } = router;
  const currentLocale = locale || defaultLocale;

  useEffect(() => {
    async function fetchAppStoreData() {
      if (!siteConfig.ios_app_id) return;

      let iosAppCountry = 'us'; // Default country
      try {
        const translations = await getTranslations(currentLocale);
        iosAppCountry = translations?.global?.ios_app_country || siteConfig.defaultLanguage || siteConfig.default_lang || 'us';
      } catch (e) {
        console.warn('Could not load translations for AppStoreImages country code, using default.');
      }

      const apiUrl = `https://itunes.apple.com/lookup?id=${siteConfig.ios_app_id}&country=${iosAppCountry}&callback=?`;

      // jQuery's getJSON with a callback=? is for JSONP, which is tricky to replicate with fetch directly due to CORS.
      // For a modern approach, if the API supports CORS, a direct fetch is better.
      // If JSONP is strictly required, a library or a more complex setup might be needed.
      // This example simulates a fetch, but for JSONP, you'd typically add a script tag.

      // Simplified fetch assuming the API endpoint might work with a standard fetch or for demonstration
      // In a real JSONP scenario, you'd dynamically add a script tag and define a global callback.
      try {
        // This is a placeholder for how you might fetch. JSONP is different.
        // const response = await fetch(apiUrl.replace("&callback=?", "")); // Remove callback for standard fetch
        // if (!response.ok) throw new Error('Network response was not ok');
        // const data = await response.json(); 
        
        // SIMULATING JSONP by creating a script tag
        const script = document.createElement('script');
        const callbackName = 'jsonpCallback' + new Date().getTime(); // Unique callback name
        script.src = apiUrl.replace('callback=?', `callback=${callbackName}`);
        
        window[callbackName] = (json) => {
          if (json.results && json.results.length > 0) {
            const appInfo = json.results[0];
            console.info("App Store data loaded via JSONP:", appInfo);

            // Update favicon - This should ideally be managed in Layout.js or _app.js via next/head for consistency
            const faviconTag = document.querySelector('link[rel="shortcut icon"]');
            if (faviconTag) {
              faviconTag.href = appInfo.artworkUrl512; // or artworkUrl60/artworkUrl100
            }

            // The rest of the DOM manipulations (page title, icons, app name) are problematic in React's declarative style.
            // This data should be fetched in getStaticProps or getServerSideProps and passed as props to components.
            // For a 1:1 migration of this specific script's behavior, it would directly manipulate the DOM,
            // but this is an anti-pattern in Next.js/React.

            // Example: If you absolutely had to update something outside React control (not recommended)
            // const pageTitleElement = document.querySelector('.pageTitle'); // Assuming this class exists outside React components
            // if (pageTitleElement && !pageTitleElement.textContent.trim()) {
            //   pageTitleElement.textContent = appInfo.trackName;
            // }

            // If AppStoreLink needs to be updated dynamically (e.g. if not set in siteConfig)
            // This is also better handled by passing props from getStaticProps
            const appStoreLinkElements = document.querySelectorAll('.appStoreLink'); // Assuming this class is on your AppStoreButton
            appStoreLinkElements.forEach(link => {
              if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
                link.setAttribute('href', appInfo.trackViewUrl);
              }
            });

          } else {
            console.warn("No results from Apple API for ID:", siteConfig.ios_app_id);
          }
          // Clean up script and callback
          document.body.removeChild(script);
          delete window[callbackName];
        };

        script.onerror = () => {
          console.error("Failed to load App Store data script.");
          document.body.removeChild(script);
          delete window[callbackName];
        };

        document.body.appendChild(script);

      } catch (error) {
        console.error("Failed to fetch App Store data:", error);
      }
    }

    if (typeof window !== 'undefined') { // Ensure it runs only on client-side
        fetchAppStoreData();
    }

  }, [currentLocale]); // Re-run if locale changes to fetch country-specific data

  // This component primarily handles a side effect (fetching data and potentially updating DOM outside React).
  // It doesn't render anything itself, or it might render a Head component for the favicon.
  // For favicon, it's better to manage it in Layout.js or _app.js using data from getStaticProps if possible.
  return null; // Or <Head> for favicon if managed here, but see notes.
}

// Note on usage:
// If this component is meant to provide data for other components (like AppInfo, Header), 
// the data fetching strategy needs to be re-thought for Next.js.
// - Option A (Client-side as attempted here): Data is fetched after page load. UI elements might update after initial render.
//   Direct DOM manipulation is an anti-pattern.
// - Option B (Build-time/Server-side - Preferred for SSG/SSR):
//   Fetch data in getStaticProps (for SSG) or getServerSideProps (for SSR) in the PARENT PAGE.
//   Pass the fetched data (appInfo) as props to the necessary components (Layout, AppInfo, Header).
//   This ensures data is available at build time or initial render, leading to better SEO and no layout shifts.

// The original script updates: Favicon, Page Title, App Icons (large, header), App Name (general, header), Price, App Store Link.
// Most of these should be populated via props from getStaticProps in a Next.js app.
