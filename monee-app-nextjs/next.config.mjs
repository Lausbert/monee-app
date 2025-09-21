/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  i18n: {
    locales: ['en', 'de', 'fr', 'es', 'pt', 'it', 'ru', 'hi', 'el', 'tr'],
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
      {
        source: '/ru/android/',
        destination: '/ru/',
        permanent: true,
      },
      {
        source: '/hi/android/',
        destination: '/hi/',
        permanent: true,
      },
      {
        source: '/el/android/',
        destination: '/el/',
        permanent: true,
      },
      {
        source: '/tr/android/',
        destination: '/tr/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
