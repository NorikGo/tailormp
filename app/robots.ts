import { MetadataRoute } from 'next'

/**
 * Robots.txt Generation
 *
 * Controls which pages search engines can crawl
 * Provides sitemap location
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/tailor/dashboard',
          '/tailor/*',
          '/api/',
          '/api/*',
          '/*.env',
          '/.env*',
          '/admin',
          '/admin/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
