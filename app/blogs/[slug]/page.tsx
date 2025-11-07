import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Eye, Share2, ArrowLeft, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import BlogCard from '@/components/blog/BlogCard'
import AuthorImage from '@/components/blog/AuthorImage'
import DatabaseError from '@/components/DatabaseError'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import User from '@/models/User'

// Enable ISR with 60 second revalidation
export const revalidate = 60

// Fetch blog from database
async function getBlogBySlug(slug: string) {
  try {
    await dbConnect()

    const blogData = await Blog.findOne({ slug, status: 'published' })
      .select('title slug metaTitle metaDescription keywords ogImage excerpt content featuredImage imageAlt category tags publishedAt createdAt readingTime views author sections internalLinks externalReferences')
      .lean()

    if (!blogData || Array.isArray(blogData)) {
      return null
    }

    // Type assertion to ensure TypeScript knows this is a single document
    const blog: any = blogData

    // Manually fetch author if exists
    let authorData: any = null
    if (blog.author) {
      authorData = await User.findById(blog.author)
        .select('name email avatar bio')
        .lean()
    }

    return {
      _id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      metaTitle: blog.metaTitle || blog.title,
      metaDescription: blog.metaDescription || blog.excerpt,
      keywords: blog.keywords || [],
      ogImage: blog.ogImage || blog.featuredImage,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage,
      imageAlt: blog.imageAlt || blog.title,
      category: blog.category,
      tags: blog.tags || [],
      publishedAt: blog.publishedAt || blog.createdAt,
      readingTime: blog.readingTime || 5,
      views: blog.views || 0,
      author: {
        _id: (authorData as any)?._id?.toString() || 'default',
        name: (authorData as any)?.name || 'Abhinav',
        email: (authorData as any)?.email,
        avatar: (authorData as any)?.avatar || '/images/author-abhinav.jpg',
        bio: (authorData as any)?.bio || 'Dr. Abhinav is a dedicated scholar, educator, and researcher specializing in marketing, analytics, and artificial intelligence. As both a PhD and professor, he brings a unique blend of academic rigor and practical insight to his work, guiding students and professionals toward data-driven decision-making in an increasingly digital world.\n\nPassionate about making knowledge accessible to everyone, Dr. Abhinav\'s mission is to empower individuals with the tools and understanding needed to thrive in the age of AI and analytics. His contributions to the field have been recognized with numerous awards for excellence in research, teaching, and innovation.\n\nDriven by curiosity and purpose, he continues to explore how technology, data, and human behavior intersect to shape the future of marketing and education.',
      },
      sections: blog.sections || [],
      internalLinks: blog.internalLinks || [],
      externalReferences: blog.externalReferences || [],
    }
  } catch (error) {
    console.error('Error fetching blog:', error)
    // Return null instead of crashing
    return null
  }
}

async function getRelatedBlogs(currentBlogId: string, category: string) {
  try {
    await dbConnect()

    // Single optimized query using $or to get all 3 blogs at once
    const relatedBlogs = await Blog.find({
      _id: { $ne: currentBlogId },
      status: 'published',
      $or: [
        { category: category },
        { category: { $ne: category } }
      ]
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('title slug excerpt category tags featuredImage publishedAt createdAt readingTime views author')
      .lean()

    // Manually fetch authors for all related blogs
    const authorIds = relatedBlogs.map((b: any) => b.author).filter(Boolean)
    let authors: any[] = []
    if (authorIds.length > 0) {
      authors = await User.find({ _id: { $in: authorIds } })
        .select('name avatar bio')
        .lean()
    }
    const authorMap = new Map(authors.map((a: any) => [a._id.toString(), a]))

    return relatedBlogs.map((blog: any) => {
      const author = blog.author ? authorMap.get(blog.author.toString()) : null
      return {
        _id: blog._id.toString(),
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || blog.title.substring(0, 150) + '...',
        category: blog.category,
        tags: blog.tags || [],
        featuredImage: blog.featuredImage || '/images/blog-placeholder.jpg',
        publishedAt: blog.publishedAt || blog.createdAt,
        readingTime: blog.readingTime || 5,
        views: blog.views || 0,
        author: {
          name: author?.name || 'Abhinav',
          avatar: author?.avatar || '',
          bio: author?.bio || 'Dr. Abhinav is a dedicated scholar, educator, and researcher specializing in marketing, analytics, and artificial intelligence.',
        },
      }
    })
  } catch (error) {
    console.error('Error fetching related blogs:', error)
    // Return empty array instead of crashing
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.keywords,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      type: 'article',
      publishedTime: blog.publishedAt.toISOString(),
      authors: [blog.author.name],
      tags: blog.tags,
      images: [
        {
          url: blog.ogImage || blog.featuredImage,
          width: 1200,
          height: 630,
          alt: blog.imageAlt || blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: [blog.ogImage || blog.featuredImage],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    // Check if it's a database error or just not found
    try {
      await dbConnect()
      // If dbConnect succeeds but blog is null, it's really not found
      notFound()
    } catch (error) {
      // If dbConnect fails, show database error page
      return <DatabaseError />
    }
  }

  const relatedBlogs = await getRelatedBlogs(blog._id, blog.category)

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage,
    datePublished: blog.publishedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: blog.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Shikhaa - Political Analyst',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yourdomain.com/blogs/${blog.slug}`,
    },
    keywords: blog.keywords.join(', '),
    articleSection: blog.category,
    wordCount: blog.content.split(' ').length,
  }

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4 border-b">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-primary">Blogs</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{blog.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <article className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Back Button */}
          <Link
            href="/blogs"
            className="inline-flex items-center text-primary hover:text-accent mb-8 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Link>

          {/* Category Badge */}
          <div className="text-sm text-accent font-semibold mb-4">
            {blog.category}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <AuthorImage src={blog.author.avatar} alt={blog.author.name} size="small" />
              <div>
                <p className="font-semibold text-gray-900">{blog.author.name}</p>
                <p className="text-sm">PhD & Professor | Marketing, Analytics & AI</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(blog.publishedAt), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{blog.readingTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{blog.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="aspect-video rounded-xl mb-12 relative overflow-hidden">
              <img
                src={blog.featuredImage}
                alt={blog.imageAlt || blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-accent prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">TAGS</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blogs?search=${tag}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 rounded-lg transition-colors duration-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Internal Links */}
          {blog.internalLinks.length > 0 && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-serif font-bold text-primary mb-4">Related Reading</h3>
              <ul className="space-y-2">
                {blog.internalLinks.map((link: any) => (
                  <li key={link.url}>
                    <Link
                      href={link.url}
                      className="text-accent hover:text-primary font-medium hover:underline"
                    >
                      → {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* External References */}
          {blog.externalReferences.length > 0 && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-serif font-bold text-primary mb-4">References & Sources</h3>
              <ul className="space-y-3">
                {blog.externalReferences.map((ref: any, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <ExternalLink className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-primary font-medium hover:underline"
                      >
                        {ref.title}
                      </a>
                      <p className="text-sm text-gray-600">{ref.source}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-12 p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl border">
            <div className="flex items-start gap-4">
              <AuthorImage src={blog.author.avatar} alt={blog.author.name} size="large" />
              <div>
                <h3 className="text-xl font-serif font-bold text-primary mb-2">
                  About {blog.author.name}
                </h3>
                <div className="text-gray-700 mb-4 whitespace-pre-line">
                  {blog.author.bio}
                </div>
                <Link href="/about" className="text-accent hover:text-primary font-semibold">
                  View Full Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Suggested Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Suggested Reading
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard key={relatedBlog._id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Want More Insights?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Subscribe to receive weekly analysis and stay ahead of policy trends.
          </p>
          <Link href="/contact" className="btn-primary bg-accent hover:bg-accent-dark text-lg px-8 py-4">
            Subscribe Now
          </Link>
        </div>
      </section>
    </>
  )
}
