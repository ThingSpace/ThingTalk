import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://athing.space',
    siteName: 'A Thing',
  },
  twitter: {
    site: '@theathingapp',
    cardType: 'summary_large_image',
  },
  description: 'A Thing is a place to write.',
  titleTemplate: '%s | A-Thing',
  defaultTitle: '<3 You got this',
  themeColor: '#000000',
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'icon',
      href: '/favicon-16x16.png',
      sizes: '16x16',
    },
    {
      rel: 'icon',
      href: '/favicon-32x32.png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      href: '/android-chrome-192x192.png',
      sizes: '192x192',
    },
    {
      rel: 'icon',
      href: '/android-chrome-512x512.png',
      sizes: '512x512',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    }
  ]
};

export default config;
