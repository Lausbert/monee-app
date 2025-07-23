/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  i18n: {
    locales: ['en', 'de', 'fr', 'es', 'pt', 'it'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

export default nextConfig;
