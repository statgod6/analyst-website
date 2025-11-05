'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    type: 'report',
    description: '',
    summary: '',
    valuePropositions: '',
    features: '',
    targetAudience: '',
    coverImage: '',
    previewImages: [] as string[],
    price: '',
    currency: 'INR',
    discount: {
      active: false,
      percentage: 0,
    },
    fileUrl: '',
    fileSize: '',
    fileFormat: 'PDF',
    pageCount: '',
    status: 'active',
    testimonials: [
      { author: '', role: '', company: '', location: '', content: '', rating: 5 },
      { author: '', role: '', company: '', location: '', content: '', rating: 5 },
      { author: '', role: '', company: '', location: '', content: '', rating: 5 },
      { author: '', role: '', company: '', location: '', content: '', rating: 5 },
      { author: '', role: '', company: '', location: '', content: '', rating: 5 },
      { author: '', role: '', company: '', location: '', content: '', rating: 5 },
    ],
  })

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/products/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }

      const data = await response.json()
      const product = data.product

      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        keywords: Array.isArray(product.keywords) ? product.keywords.join(', ') : '',
        type: product.type || 'report',
        description: product.description || '',
        summary: product.summary || '',
        valuePropositions: Array.isArray(product.valuePropositions) 
          ? product.valuePropositions.join('\n') 
          : '',
        features: Array.isArray(product.features) 
          ? product.features.join('\n') 
          : '',
        targetAudience: product.targetAudience || '',
        coverImage: product.coverImage || '',
        previewImages: Array.isArray(product.previewImages) ? product.previewImages : [],
        price: product.price?.toString() || '',
        currency: product.currency || 'INR',
        discount: product.discount || { active: false, percentage: 0 },
        fileUrl: product.fileUrl || '',
        fileSize: product.fileSize || '',
        fileFormat: product.fileFormat || 'PDF',
        pageCount: product.pageCount?.toString() || '',
        status: product.status || 'active',
        testimonials: Array.isArray(product.testimonials) && product.testimonials.length > 0
          ? [...product.testimonials.slice(0, 6).map((t: any) => ({
              author: t.author || '',
              role: t.role || '',
              company: t.company || '',
              location: t.location || '',
              content: t.content || '',
              rating: t.rating || 5
            })), ...Array(Math.max(0, 6 - product.testimonials.length)).fill({
              author: '',
              role: '',
              company: '',
              location: '',
              content: '',
              rating: 5
            })]
          : [
              { author: '', role: '', company: '', location: '', content: '', rating: 5 },
              { author: '', role: '', company: '', location: '', content: '', rating: 5 },
              { author: '', role: '', company: '', location: '', content: '', rating: 5 },
              { author: '', role: '', company: '', location: '', content: '', rating: 5 },
              { author: '', role: '', company: '', location: '', content: '', rating: 5 },
              { author: '', role: '', company: '', location: '', content: '', rating: 5 },
            ],
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Failed to load product')
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        pageCount: parseInt(formData.pageCount) || 0,
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : [],
        valuePropositions: formData.valuePropositions 
          ? formData.valuePropositions.split('\n').filter(v => v.trim())
          : [],
        features: formData.features 
          ? formData.features.split('\n').filter(f => f.trim())
          : [],
        previewImages: formData.previewImages.filter(img => img.trim()),
        testimonials: formData.testimonials.filter(t => t.author.trim() && t.content.trim()),
      }

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product')
      }

      alert('Product updated successfully!')
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error updating product:', error)
      alert(error.message || 'Failed to update product')
    } finally {
      setSaving(false)
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
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Edit Product</h1>
            <p className="text-gray-600 mt-1">Update product details</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-sm text-gray-500 mt-1">URL-friendly version of the name</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ai-prompts">AI Prompts</option>
                <option value="ai-guides">AI Guides</option>
                <option value="ai-agents">AI Agents</option>
                <option value="ai-automation">AI Automation</option>
                <option value="ai-templates">AI Templates</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={3}
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">SEO</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          
          <div className="space-y-4">
            <div>
              <ImageUpload
                value={formData.coverImage}
                onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                label="Cover Image (Main Product Image)"
                required={true}
                showAltText={false}
              />
              <p className="text-sm text-gray-500 mt-1">This will be the primary image displayed on the product page</p>
            </div>

            {/* Preview Images (Multiple) */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Preview Images (Optional)
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Add up to 5 additional images to showcase your product from different angles or highlight features
              </p>
              
              <div className="space-y-4">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <ImageUpload
                      value={formData.previewImages[index] || ''}
                      onChange={(url) => {
                        const newImages = [...formData.previewImages]
                        newImages[index] = url
                        setFormData(prev => ({ ...prev, previewImages: newImages }))
                      }}
                      label={`Preview Image ${index + 1}`}
                      required={false}
                      showAltText={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File URL * (Secure link to the actual product file)
              </label>
              <input
                type="url"
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Size
                </label>
                <input
                  type="text"
                  name="fileSize"
                  value={formData.fileSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Format
                </label>
                <input
                  type="text"
                  name="fileFormat"
                  value={formData.fileFormat}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Count
                </label>
                <input
                  type="number"
                  name="pageCount"
                  value={formData.pageCount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value Propositions (one per line)
              </label>
              <textarea
                name="valuePropositions"
                value={formData.valuePropositions}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features (one per line)
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Testimonials (Optional)</h2>
          <p className="text-sm text-gray-600 mb-6">Add up to 6 customer testimonials for this product</p>
          
          <div className="space-y-6">
            {formData.testimonials.map((testimonial, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <h3 className="font-semibold text-primary mb-4">Testimonial {index + 1}</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={testimonial.author}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials]
                        newTestimonials[index].author = e.target.value
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }))
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Rajesh Kumar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role/Position
                    </label>
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials]
                        newTestimonials[index].role = e.target.value
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }))
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Financial Analyst"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={testimonial.company || ''}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials]
                        newTestimonials[index].company = e.target.value
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }))
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., ICICI Securities"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={testimonial.location || ''}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials]
                        newTestimonials[index].location = e.target.value
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }))
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Mumbai, India"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testimonial Content
                    </label>
                    <textarea
                      value={testimonial.content}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials]
                        newTestimonials[index].content = e.target.value
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }))
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="The customer's feedback about your product..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={testimonial.rating}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials]
                        newTestimonials[index].rating = parseInt(e.target.value)
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }))
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
