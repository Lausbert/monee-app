import Head from 'next/head';
import siteConfig from '@/lib/siteConfig';

const JsonLd = ({ translations, currentLocale = 'en' }) => {
  // Get app information from translations and config
  const appName = translations?.global?.app_name || siteConfig.app_name;
  const appDescription = translations?.global?.app_description || siteConfig.app_description;
  const appKeywords = translations?.global?.app_keywords || siteConfig.app_keywords;
  const appScreenshot = translations?.global?.app_screenshot || 'assets/screenshot_en.webp';
  
  // Create the JSON-LD structured data for Mobile Application
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": appName,
    "description": appDescription,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "iOS",
    "url": siteConfig.site_url,
    "downloadUrl": siteConfig.appstore_link,
    "image": `${siteConfig.site_url}/${appScreenshot}`,
    "screenshot": `${siteConfig.site_url}/${appScreenshot}`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "4000"
    },
    "author": {
      "@type": "Person",
      "name": siteConfig.your_name,
      "url": siteConfig.your_link
    },
    "publisher": {
      "@type": "Person",
      "name": siteConfig.your_name,
      "url": siteConfig.your_link
    },
    "applicationSubCategory": "Budget Tracker",
    "keywords": appKeywords,
    "softwareVersion": "Latest",
    "datePublished": "2021-12-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "genre": "Finance",
    "inLanguage": currentLocale,
    "isAccessibleForFree": true,
    "featureList": [
      "Quick & Easy Entry",
      "Insightful Overview", 
      "Shared Household",
      "Unlimited Accounts",
      "Unlimited Transactions",
      "Recurring Transactions",
      "Custom Categories",
      "Powerful Filters",
      "Worldwide Currencies",
      "Export Data",
      "Seamless Across Devices",
      "Biometric & Code Protection",
      "Flexible Monthly Start",
      "Balance Transfer",
      "No Registration",
      "No Ads, No Tracking",
      "100% Free"
    ]
  };

  // Add additional structured data for the Organization/Developer
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteConfig.your_name,
    "url": siteConfig.your_link,
    "email": siteConfig.email_address,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": siteConfig.your_city,
      "addressCountry": "DE"
    },
    "sameAs": [
      siteConfig.your_link,
      `https://github.com/${siteConfig.github_username}`
    ]
  };

  // Create Website structured data
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": appName,
    "description": appDescription,
    "url": siteConfig.site_url,
    "publisher": {
      "@type": "Person",
      "name": siteConfig.your_name
    },
    "inLanguage": siteConfig.languages,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.site_url}/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
    </Head>
  );
};

export default JsonLd;
