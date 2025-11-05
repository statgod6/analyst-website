'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, DollarSign, Download } from 'lucide-react'

interface Product {
  _id: string
  name: string
  type: string
  price: number
  currency: string
  status: 'active' | 'inactive' | 'coming-soon'
  purchaseCount: number
  rating: number
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/products?limit=100')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      setProducts(products.filter(product => product._id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || product.type === filterType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'coming-soon': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeBadge = (type: string) => {
    const types: { [key: string]: string } = {
      'ai-prompts': 'AI Prompts',
      'ai-guides': 'AI Guides',
      'ai-agents': 'AI Agents',
      'ai-automation': 'AI Automation',
      'ai-templates': 'AI Templates',
    }
    return types[type] || type
  }

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.purchaseCount), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Products</h1>
          <p className="text-gray-600 mt-1">Manage your digital products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Product
        </Link>
      </div>

      {/* Revenue Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Products</p>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Sales</p>
            <Download className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {products.reduce((sum, p) => sum + p.purchaseCount, 0)}
          </p>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {totalRevenue.toLocaleString()} (Mixed)
          </p>
          <p className="text-xs text-gray-500 mt-1">Multiple currencies</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="ai-prompts">AI Prompts</option>
            <option value="ai-guides">AI Guides</option>
            <option value="ai-agents">AI Agents</option>
            <option value="ai-automation">AI Automation</option>
            <option value="ai-templates">AI Templates</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {getTypeBadge(product.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {product.currency === 'INR' ? '₹' : '$'}{product.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.purchaseCount} sales
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
