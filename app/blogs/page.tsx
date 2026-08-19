import { Metadata } from 'next'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import BlogCard from '@/components/blog/BlogCard'
import BlogFilters from '@/components/blog/BlogFilters'
import DatabaseError from '@/components/DatabaseError'
import { prisma, serializeBlog } from '@/lib/db'

export const metadata: Metadata = {
  title: 'AI Guides & Tips Blog | Learn AIE for Everyone',
  description: 'Practical AI guides, tutorials, and tips. Learn how to use ChatGPT, AI prompts, automation strategies, and money-making techniques with AI.',
  keywords: ['AI guides', 'AI tutorials', 'ChatGPT tips', 'AI prompts', 'AI money making', 'AI automation'],
}

// Enable ISR with 60 second revalidation
export const revalidate = 60
export const dynamic = 'force-dynamic'

// Fetch blogs from database
async function getBlogs(searchParams: any) {
  try {
    const query: any = { status: 'published' }

    if (searchParams.category) {
      const categoryMap: { [key: string]: string } = {
        'ai-tools-platforms': 'AI Tools & Platforms',
        'ai-prompts-techniques': 'AI Prompts & Techniques',
        'ai-automation': 'AI Automation',
        'ai-money-making': 'AI Money Making',
        'ai-agents': 'AI Agents',
        'chatgpt-llms': 'ChatGPT & LLMs',
        'ai-for-business': 'AI for Business',
        'ai-guides-tutorials': 'AI Guides & Tutorials',
      }
      if (categoryMap[searchParams.category]) {
        query.category = categoryMap[searchParams.category]
      }
    }

    if (searchParams.search) {
      query.OR = [
        { title: { contains: searchParams.search } },
        { excerpt: { contains: searchParams.search } },
        { tags: { contains: searchParams.search } },
      ]
    }

    const blogs = await prisma.blog.findMany({
      where: query,
      include: { author: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })

    return blogs.map((rawBlog: any) => {
      const blog = serializeBlog(rawBlog) as any
      const author = blog.author && typeof blog.author === 'object' ? blog.author : null
      return {
        _id: blog._id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || blog.title.substring(0, 150) + '...',
        category: blog.category,
        tags: blog.tags || [],
        featuredImage: blog.featuredImage || '/images/blog-placeholder.jpg',
        imageAlt: blog.imageAlt || blog.title,
        publishedAt: blog.publishedAt || blog.createdAt,
        readingTime: blog.readingTime || 5,
        views: blog.views || 0,
        author: {
          name: author?.name || 'Abhinav',
          avatar: author?.avatar || '',
        },
      }
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const blogs = await getBlogs(searchParams)

  // Count blogs by category
  let categoryCounts: any[] = []
  let totalBlogs = 0
  let hasDbError = false
  
  try {
    const publishedBlogs = await prisma.blog.findMany({
      where: { status: 'published' },
      select: { category: true },
    })
    const counts = publishedBlogs.reduce((acc: Record<string, number>, blog: { category: string }) => {
      acc[blog.category] = (acc[blog.category] || 0) + 1
      return acc
    }, {})
    categoryCounts = Object.entries(counts).map(([category, count]) => ({ category, count }))
    totalBlogs = publishedBlogs.length
  } catch (error) {
    console.error('Error fetching category counts:', error)
    hasDbError = true
  }

  // Show database error page if there's a connection issue
  if (hasDbError) {
    return <DatabaseError />
  }

  const categoryMap: { [key: string]: number } = {}
  categoryCounts.forEach((cat: any) => {
    categoryMap[cat.category] = cat.count
  })

  const categories = [
    { name: 'All', slug: 'all', count: totalBlogs },
    { name: 'AI Tools & Platforms', slug: 'ai-tools-platforms', count: categoryMap['AI Tools & Platforms'] || 0 },
    { name: 'AI Prompts & Techniques', slug: 'ai-prompts-techniques', count: categoryMap['AI Prompts & Techniques'] || 0 },
    { name: 'AI Automation', slug: 'ai-automation', count: categoryMap['AI Automation'] || 0 },
    { name: 'AI Money Making', slug: 'ai-money-making', count: categoryMap['AI Money Making'] || 0 },
    { name: 'AI Agents', slug: 'ai-agents', count: categoryMap['AI Agents'] || 0 },
    { name: 'ChatGPT & LLMs', slug: 'chatgpt-llms', count: categoryMap['ChatGPT & LLMs'] || 0 },
    { name: 'AI for Business', slug: 'ai-for-business', count: categoryMap['AI for Business'] || 0 },
    { name: 'AI Guides & Tutorials', slug: 'ai-guides-tutorials', count: categoryMap['AI Guides & Tutorials'] || 0 },
  ]

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI Guides & Learning Resources</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Practical tutorials, tips, and strategies to master AI tools and boost your productivity and income.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom">
          <BlogFilters categories={categories} currentCategory={searchParams.category} />
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No blog posts found matching your criteria.</p>
              <Link href="/blogs" className="btn-primary mt-6 inline-block">
                View All Blogs
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogs.map((blog: any) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>

              {/* Pagination would go here in a real app */}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Never Miss an AI Update</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Get weekly AI tips, prompts, and strategies delivered to your inbox.
          </p>
          <Link href="/contact" className="btn-primary bg-accent hover:bg-accent-dark">
            Subscribe Now
          </Link>
        </div>
      </section>
    </>
  )
}
