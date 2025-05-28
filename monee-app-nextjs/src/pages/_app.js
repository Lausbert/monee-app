import "@/styles/globals.scss";
import { TranslationsProvider } from "@/context/TranslationsContext";

export default function App({ Component, pageProps }) {
  // Extract translations from pageProps
  const { globalTranslations = {}, ...restPageProps } = pageProps;
  
  // Wrap with TranslationsProvider for global access
  return (
    <TranslationsProvider translations={globalTranslations}>
      <Component {...restPageProps} />
    </TranslationsProvider>
  );
}
