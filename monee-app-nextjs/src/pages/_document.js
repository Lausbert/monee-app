import { Html, Head, Main, NextScript } from "next/document";
import siteConfig from "../lib/siteConfig"; // Using default import

export default function Document() {
  // Note: The lang attribute on <html> should ideally be dynamic based on the current locale.
  // This is tricky in _document.js as it's rendered on the server without access to router.locale.
  // Next.js handles this automatically if i18n is configured in next.config.js.
  // For explicit control, you might need a custom server or other strategies.
  // For now, we'll rely on Next.js's default behavior or set a fallback.
  const currentLang = siteConfig.defaultLanguage || siteConfig.default_lang || 'en'; // Use defaultLanguage or default_lang with fallback

  return (
    <Html lang={currentLang}>
      <Head>
        {/* Prevent search engine indexing */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
