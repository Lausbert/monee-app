/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  i18n: {
    locales: ['en', 'de', 'fr', 'es'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

export default nextConfig;
