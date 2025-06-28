/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'de', 'fr'],
    defaultLocale: 'en',
    localeDetection: true,
  },
};

export default nextConfig;
