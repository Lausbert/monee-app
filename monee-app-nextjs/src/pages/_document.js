import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // Next.js automatically handles the lang attribute when i18n is configured in next.config.js
  // We should not manually set the lang attribute to avoid conflicts with Next.js i18n

  return (
    <Html>
      <Head>
        {/* Font Awesome CDN for social icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" 
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
