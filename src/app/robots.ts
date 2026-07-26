import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/sanity/'],
    },
    sitemap: 'https://www.omshakthy.com/sitemap.xml',
  }
}
