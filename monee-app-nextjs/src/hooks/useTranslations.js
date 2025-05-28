// filepath: c:\Users\esemusa\monee-app\monee-app-nextjs\src\hooks\useTranslations.js
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslationsContext } from '@/context/TranslationsContext';

// This is an improved version of useTranslations optimized for static site generation
export default function useTranslations(pageTranslations) {
  const router = useRouter();
  const { locale = 'en' } = router;
  
  // Get global translations from context
  const globalTranslations = useTranslationsContext();
  
  // For SSG, we focus on using pre-provided translations
  // pageTranslations would be passed from getStaticProps
  const translations = useMemo(() => {
    // Use provided pageTranslations first, fall back to global context
    return pageTranslations || globalTranslations || {};
  }, [pageTranslations, globalTranslations]);
    // Function to get a specific translation string
  const t = (path) => {
    if (!path) return ''; // Handle empty path gracefully
    
    const keys = path.split('.');
    let current = translations;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return path; // Return the key as fallback
      }
    }
    
    return typeof current === 'string' ? current : path;
  };

  return { t, locale, isLoading: false, translations };
}
