// SEO and Schema Markup Utilities

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
}

/**
 * Generate comprehensive meta tags for a page
 */
export function generateMetaTags(config: SEOConfig) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const fullUrl = config.url ? `${baseUrl}${config.url}` : baseUrl
  const imageUrl = config.image ? `${baseUrl}${config.image}` : `${baseUrl}/og-default.png`

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', '),
    openGraph: {
      title: config.title,
      description: config.description,
      url: fullUrl,
      type: config.type || 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
      ...(config.author && { authors: [config.author] }),
      ...(config.section && { section: config.section }),
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [imageUrl],
      creator: '@yourhandle',
    },
  }
}

/**
 * Generate JSON-LD schema for Organization
 */
export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI for Everyone',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Practical AI guides, prompts, and money-making strategies for everyone.',
    sameAs: [
      'https://linkedin.com/in/yourprofile',
      'https://twitter.com/yourhandle',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@yourdomain.com',
      contactType: 'Customer Service',
    },
  }
}

/**
 * Generate JSON-LD schema for Person (About page)
 */
export function generatePersonSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI for Everyone',
    url: baseUrl,
    image: `${baseUrl}/logo.png`,
    description: 'Making AI accessible and profitable for everyone through practical guides, prompts, and strategies.',
    sameAs: [
      'https://linkedin.com/in/yourprofile',
      'https://twitter.com/yourhandle',
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'AI Prompts',
      'AI Agents',
      'AI Automation',
      'AI Money Making',
    ],
  }
}

/**
 * Generate JSON-LD schema for Blog Article
 */
export function generateBlogPostSchema(blog: {
  title: string
  description: string
  image: string
  url: string
  publishedAt: Date
  modifiedAt?: Date
  author: string
  keywords: string[]
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    image: `${baseUrl}${blog.image}`,
    datePublished: blog.publishedAt.toISOString(),
    dateModified: blog.modifiedAt?.toISOString() || blog.publishedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: blog.author,
      url: `${baseUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI for Everyone',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${blog.url}`,
    },
    keywords: blog.keywords.join(', '),
  }
}

/**
 * Generate JSON-LD schema for Product
 */
export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  price: number
  currency: string
  url: string
  rating?: number
  reviewCount?: number
  availability?: 'InStock' | 'OutOfStock'
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `${baseUrl}${product.image}`,
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      url: `${baseUrl}${product.url}`,
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount?.toString() || '1',
        bestRating: '5',
        worstRating: '1',
      },
    }),
  }
}

/**
 * Generate JSON-LD schema for Breadcrumb
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}

/**
 * Generate JSON-LD schema for Website
 */
export function generateWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI for Everyone',
    url: baseUrl,
    description: 'Practical AI guides, prompts, and money-making strategies for everyone.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Extract keywords from content
 */
export function extractKeywords(content: string, count: number = 10): string[] {
  // Remove common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
  ])

  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))

  const wordFreq = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word)
}

/**
 * Validate SEO fields
 */
export function validateSEO(data: {
  title: string
  description: string
  keywords?: string[]
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (data.title.length < 30 || data.title.length > 60) {
    errors.push('Title should be between 30-60 characters')
  }

  if (data.description.length < 120 || data.description.length > 160) {
    errors.push('Description should be between 120-160 characters')
  }

  if (data.keywords && data.keywords.length < 3) {
    errors.push('Should have at least 3 keywords')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
