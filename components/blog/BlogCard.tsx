import Link from 'next/link'
import { Calendar, Clock, Eye } from 'lucide-react'
import { format } from 'date-fns'

interface BlogCardProps {
  blog: {
    _id: string
    title: string
    slug: string
    excerpt: string
    category: string
    tags: string[]
    featuredImage: string
    publishedAt: Date
    readingTime: number
    views: number
    author: {
      name: string
      avatar: string
    }
  }
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="card overflow-hidden group h-full flex flex-col">
      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Category Badge */}
        <div className="text-sm font-semibold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          {blog.category}
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-bold mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">
          <Link href={`/blogs/${blog.slug}`}>
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {blog.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{blog.readingTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{blog.views.toLocaleString()}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {blog.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 text-xs rounded-md font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
