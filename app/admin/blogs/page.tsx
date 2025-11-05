'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'

interface Blog {
  _id: string
  title: string
  category: string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: Date
  views: number
  readingTime: number
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    fetchBlogs()
  }, [filterStatus, filterCategory, searchTerm])

  const fetchBlogs = async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterCategory !== 'all') params.append('category', filterCategory)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/admin/blogs?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }

      const data = await response.json()
      setBlogs(data.blogs)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setLoading(false)
      // Fallback to empty array on error
      setBlogs([])
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete blog')
      }

      setBlogs(blogs.filter(blog => blog._id !== id))
      alert('Blog deleted successfully')
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Failed to delete blog. Please try again.')
    }
  }

  const filteredBlogs = blogs

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Blog Posts</h1>
          <p className="text-gray-600 mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/blogs/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Blog Post
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            <option value="AI Tools & Platforms">AI Tools & Platforms</option>
            <option value="AI Prompts & Techniques">AI Prompts & Techniques</option>
            <option value="AI Automation">AI Automation</option>
            <option value="AI Money Making">AI Money Making</option>
            <option value="AI Agents">AI Agents</option>
            <option value="ChatGPT & LLMs">ChatGPT & LLMs</option>
            <option value="AI for Business">AI for Business</option>
            <option value="AI Guides & Tutorials">AI Guides & Tutorials</option>
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{blog.title}</p>
                      <p className="text-sm text-gray-500">{blog.readingTime} min read</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{blog.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(blog.status)}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {blog.publishedAt ? format(new Date(blog.publishedAt), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Eye className="h-4 w-4" />
                      {blog.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blogs/${blog._id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No blogs found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredBlogs.length} of {blogs.length} blogs
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
