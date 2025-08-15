/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  i18n: {
    locales: ['en', 'de', 'fr', 'es', 'pt', 'it'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  async redirects() {
    return [
      // Redirect old Android pages to main site
      {
        source: '/android/',
        destination: '/',
        permanent: true,
      },
      {
        source: '/de/android/',
        destination: '/de/',
        permanent: true,
      },
      {
        source: '/fr/android/',
        destination: '/fr/',
        permanent: true,
      },
      {
        source: '/es/android/',
        destination: '/es/',
        permanent: true,
      },
      {
        source: '/pt/android/',
        destination: '/pt/',
        permanent: true,
      },
      {
        source: '/it/android/',
        destination: '/it/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
