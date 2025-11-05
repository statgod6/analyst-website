'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface BlogFiltersProps {
  categories: { name: string; slug: string; count: number }[]
  currentCategory?: string
}

export default function BlogFilters({ categories, currentCategory }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blogs?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push('/blogs')
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.slug === 'all' ? '/blogs' : `/blogs?category=${category.slug}`}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              (!currentCategory && category.slug === 'all') || currentCategory === category.slug
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </Link>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full md:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full md:w-64 pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </form>
    </div>
  )
}
