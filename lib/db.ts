import prisma from '@/lib/prisma'

export { prisma }

export function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function stringifyJsonField(value: unknown): string {
  return JSON.stringify(value ?? [])
}

export function serializeDate(value: Date | string | null | undefined) {
  return value ? new Date(value).toISOString() : value
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function serializeUser(user: any) {
  if (!user) return null
  return {
    ...user,
    _id: user.id,
    createdAt: serializeDate(user.createdAt),
    updatedAt: serializeDate(user.updatedAt),
  }
}

export function serializeBlog(blog: any) {
  if (!blog) return null
  const author = serializeUser(blog.author)
  return {
    ...blog,
    _id: blog.id,
    author: author || blog.authorId || blog.author,
    authorId: blog.authorId,
    keywords: parseJsonField<string[]>(blog.keywords, []),
    tags: parseJsonField<string[]>(blog.tags, []),
    sections: parseJsonField<any[]>(blog.sections, []),
    internalLinks: parseJsonField<any[]>(blog.internalLinks, []),
    externalReferences: parseJsonField<any[]>(blog.externalReferences, []),
    relatedPosts: parseJsonField<string[]>(blog.relatedPosts, []),
    publishedAt: serializeDate(blog.publishedAt),
    createdAt: serializeDate(blog.createdAt),
    updatedAt: serializeDate(blog.updatedAt),
  }
}

export function serializeProduct(product: any, options: { includeFileUrl?: boolean } = {}) {
  if (!product) return null
  const result: any = {
    ...product,
    _id: product.id,
    keywords: parseJsonField<string[]>(product.keywords, []),
    valuePropositions: parseJsonField<string[]>(product.valuePropositions, []),
    features: parseJsonField<string[]>(product.features, []),
    previewImages: parseJsonField<string[]>(product.previewImages, []),
    testimonials: parseJsonField<any[]>(product.testimonials, []),
    discount: {
      active: product.discountActive,
      percentage: product.discountPercentage,
      expiresAt: serializeDate(product.discountExpiresAt),
    },
    publishedAt: serializeDate(product.publishedAt),
    createdAt: serializeDate(product.createdAt),
    updatedAt: serializeDate(product.updatedAt),
  }

  if (!options.includeFileUrl) {
    delete result.fileUrl
  }

  delete result.discountActive
  delete result.discountPercentage
  delete result.discountExpiresAt
  return result
}

export function serializeOrder(order: any) {
  if (!order) return null
  return {
    ...order,
    _id: order.id,
    productId: order.product ? serializeProduct(order.product, { includeFileUrl: false }) : order.productId,
    createdAt: serializeDate(order.createdAt),
    updatedAt: serializeDate(order.updatedAt),
    lastDownloadedAt: serializeDate(order.lastDownloadedAt),
  }
}

export function serializeContact(contact: any) {
  if (!contact) return null
  return {
    ...contact,
    _id: contact.id,
    createdAt: serializeDate(contact.createdAt),
    updatedAt: serializeDate(contact.updatedAt),
  }
}

export function blogDataFromRequest(body: any) {
  return {
    title: body.title,
    slug: body.slug,
    metaTitle: body.metaTitle || body.title,
    metaDescription: body.metaDescription || null,
    keywords: stringifyJsonField(body.keywords),
    ogImage: body.ogImage || null,
    excerpt: body.excerpt || null,
    content: body.content,
    featuredImage: body.featuredImage,
    imageAlt: body.imageAlt || null,
    category: body.category,
    tags: stringifyJsonField(body.tags),
    sections: stringifyJsonField(body.sections),
    internalLinks: stringifyJsonField(body.internalLinks),
    externalReferences: stringifyJsonField(body.externalReferences),
    authorId: body.author || body.authorId || null,
    status: body.status || 'draft',
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : body.status === 'published' ? new Date() : null,
    readingTime: Number(body.readingTime || 0),
    views: Number(body.views || 0),
    relatedPosts: stringifyJsonField(body.relatedPosts),
  }
}

export function productDataFromRequest(body: any) {
  return {
    name: body.name,
    slug: body.slug,
    metaTitle: body.metaTitle || null,
    metaDescription: body.metaDescription || null,
    keywords: stringifyJsonField(body.keywords),
    type: body.type,
    description: body.description,
    summary: body.summary || null,
    valuePropositions: stringifyJsonField(body.valuePropositions),
    features: stringifyJsonField(body.features),
    targetAudience: Array.isArray(body.targetAudience) ? body.targetAudience.join(', ') : body.targetAudience || null,
    coverImage: body.coverImage,
    previewImages: stringifyJsonField(body.previewImages),
    samplePDF: body.samplePDF || null,
    price: Number(body.price || 0),
    currency: body.currency || 'USD',
    discountActive: Boolean(body.discount?.active),
    discountPercentage: Number(body.discount?.percentage || 0),
    discountExpiresAt: body.discount?.expiresAt ? new Date(body.discount.expiresAt) : null,
    fileUrl: body.fileUrl,
    fileSize: body.fileSize || null,
    fileFormat: body.fileFormat || 'PDF',
    pageCount: Number(body.pageCount || 0),
    testimonials: stringifyJsonField(body.testimonials),
    purchaseCount: Number(body.purchaseCount || 0),
    rating: Number(body.rating || 0),
    status: body.status || 'active',
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : body.status === 'active' ? new Date() : null,
  }
}

export function containsInsensitive(field: string, value: string) {
  return { [field]: { contains: value } }
}
