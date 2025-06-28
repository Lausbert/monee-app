import Layout from "@/components/Layout";
import Header from "@/components/Header";
import AppInfo from "@/components/AppInfo";
import IphonePreview from "@/components/IphonePreview";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import Newsletter from "@/components/Newsletter";
import Award from "@/components/Award";
import { getTranslations } from "@/lib/i18n";
import siteConfig from "@/lib/siteConfig";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function HomePage({
  translations,
  reviewTranslations,
  awardTranslations,
  commonTranslations,
  globalTranslations,
  allTranslations,
}) {
  return (
    <Layout
      translations={commonTranslations}
      globalTranslations={allTranslations}
      title={translations.title}
      description={translations.description}
    >
      <div className="container">
        <Header translations={allTranslations} />
        <Award translations={awardTranslations} />
      </div>
      <div className="hero-section">
        <IphonePreview translations={translations} />
        <AppInfo 
          translations={allTranslations} 
          appNameKey="global.app_name"
          appDescriptionKey="global.app_description"
          ratings={{
            starsKey: "global.app_ratings.stars",
            scoreKey: "global.app_ratings.score",
            countKey: "global.app_ratings.count",
            downloadsKey: "global.app_ratings.downloads"
          }}
        />
      </div>
      <Reviews translations={reviewTranslations} />
      <div className="container">
        <Features featuresListKey="features" translations={allTranslations} />
      </div>
      <Newsletter translations={allTranslations} />
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  // Use the locale from Next.js context or fall back to the default
  const currentLocale = locale || siteConfig.defaultLanguage;
  
  // Get all translations for the current locale
  const allTranslations = await getTranslations(currentLocale);
  
  // For individual sections, try to get them, but use empty objects as fallback
  const translations = await getTranslations(currentLocale, "homepage").catch(() => ({}));
  const commonTranslations = await getTranslations(currentLocale, "common").catch(() => ({}));
  const featureTranslations = allTranslations?.features || [];
  const reviewTranslations = allTranslations?.global?.reviews || [];
  const newsletterTranslations = await getTranslations(currentLocale, "newsletter").catch(() => ({}));
  const awardTranslations = allTranslations?.global?.award || {};
  
  // Structure them in a way that's accessible via dot notation in components
  // Make sure all properties are defined to avoid serialization errors
  const globalTranslations = allTranslations || {};

  return {
    props: {
      translations,
      commonTranslations,
      featureTranslations,
      reviewTranslations,
      newsletterTranslations,
      awardTranslations,
      globalTranslations, // The complete translations object
      allTranslations,    // Same as globalTranslations for compatibility
      currentLocale,
    },
  };
}
