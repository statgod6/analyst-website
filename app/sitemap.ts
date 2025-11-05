import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  const staticPages = [
    '',
    '/blogs',
    '/products',
    '/about',
    '/contact',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // In production, fetch actual blogs and products from database
  const sampleBlogs = [
    '/blogs/future-global-trade-policy-2025',
    '/blogs/economic-resilience-political-uncertainty',
    '/blogs/healthcare-policy-reform-business-impact',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...sampleBlogs]
}
