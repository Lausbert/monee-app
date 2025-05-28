import { createContext, useContext } from 'react';

// Create a context for translations
export const TranslationsContext = createContext({});

// Hook to consume the translation context
export const useTranslationsContext = () => {
  return useContext(TranslationsContext);
};

// Provider component for the translations context
export function TranslationsProvider({ translations, children }) {
  return (
    <TranslationsContext.Provider value={translations}>
      {children}
    </TranslationsContext.Provider>
  );
}
