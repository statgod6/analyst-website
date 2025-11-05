'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Save, Eye, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUpload from '@/components/admin/ImageUpload'
import SEOAnalyzer from '@/components/admin/SEOAnalyzer'

interface BlogFormData {
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  excerpt: string
  content: string
  featuredImage: string
  imageAlt: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
}

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    excerpt: '',
    content: '',
    featuredImage: '',
    imageAlt: '',
    category: 'Political Analysis',
    tags: [],
    status: 'draft',
  })

  useEffect(() => {
    if (params.id) {
      fetchBlog()
    }
  }, [params.id])

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog')
      }

      const data = await response.json()
      setFormData({
        title: data.blog.title,
        slug: data.blog.slug,
        metaTitle: data.blog.metaTitle || '',
        metaDescription: data.blog.metaDescription || '',
        keywords: data.blog.keywords || [],
        excerpt: data.blog.excerpt || '',
        content: data.blog.content,
        featuredImage: data.blog.featuredImage,
        imageAlt: data.blog.imageAlt || '',
        category: data.blog.category,
        tags: data.blog.tags || [],
        status: data.blog.status,
      })
      setLoading(false)
    } catch (error) {
      console.error('Fetch error:', error)
      alert('Failed to load blog. Redirecting...')
      router.push('/admin/blogs')
    }
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!formData.title || !formData.content || !formData.featuredImage) {
      alert('Please fill in all required fields: Title, Content, and Featured Image')
      return
    }

    setSaving(true)

    try {
      // Calculate reading time
      const wordsPerMinute = 200
      const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length
      const readingTime = Math.ceil(wordCount / wordsPerMinute)

      const blogData = {
        ...formData,
        status,
        readingTime,
        publishedAt: status === 'published' && formData.status === 'draft' ? new Date() : undefined,
      }

      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update blog')
      }

      alert(`Blog ${status === 'published' ? 'published' : 'updated'} successfully!`)
      router.push('/admin/blogs')
    } catch (error: any) {
      console.error('Save error:', error)
      alert(error.message || 'Failed to update blog. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete blog')
      }

      alert('Blog deleted successfully')
      router.push('/admin/blogs')
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete blog. Please try again.')
    }
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }))
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Edit Blog Post</h1>
            <p className="text-gray-600 mt-1">Update your content</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDelete}
            className="btn-secondary inline-flex items-center gap-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="btn-secondary inline-flex items-center gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {formData.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Same as new blog page */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your blog title..."
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category & Tags */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
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

              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="flex-shrink-0 px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg whitespace-nowrap font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Excerpt <span className="text-gray-500 text-xs">(max 200 characters)</span>
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief summary of your blog post..."
                maxLength={200}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/200</p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="card p-6">
            <ImageUpload
              value={formData.featuredImage}
              onChange={(url, alt) => setFormData(prev => ({ 
                ...prev, 
                featuredImage: url,
                imageAlt: alt || ''
              }))}
              label="Featured Image"
              required
            />
          </div>

          {/* Content Editor */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Content</h2>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="Start writing your blog post..."
              minHeight="500px"
            />
          </div>
        </div>

        {/* Sidebar - Same as new blog page */}
        <div className="space-y-6">
          {/* SEO Section */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">SEO Settings</h2>
            
            {/* URL Slug */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                placeholder="url-friendly-slug"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              />
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meta Title <span className="text-gray-500 text-xs">(max 60 chars)</span>
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                placeholder="SEO optimized title..."
                maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.metaTitle.length}/60</p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meta Description <span className="text-gray-500 text-xs">(max 160 chars)</span>
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="SEO meta description..."
                maxLength={160}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.metaDescription.length}/160</p>
            </div>

            {/* Focus Keywords */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Focus Keywords
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  placeholder="Add keyword..."
                  className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="flex-shrink-0 px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg whitespace-nowrap font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.keywords.map(keyword => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-purple-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO Analyzer */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">SEO Analysis</h2>
            <SEOAnalyzer
              title={formData.title}
              metaTitle={formData.metaTitle}
              metaDescription={formData.metaDescription}
              slug={formData.slug}
              content={formData.content}
              keywords={formData.keywords}
              imageAlt={formData.imageAlt}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
