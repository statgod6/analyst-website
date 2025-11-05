import Link from 'next/link'
import Image from 'next/image'
import { Star, Download, FileText, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: {
    _id: string
    name: string
    slug: string
    summary: string
    type: string
    price: number
    currency: string
    coverImage: string
    rating: number
    purchaseCount: number
    valuePropositions: string[]
    pageCount: number
    fileFormat: string
    fileSize: string
    status: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const typeLabels: { [key: string]: string } = {
    report: 'Research Report',
    ebook: 'E-Book',
    brief: 'Policy Brief',
    guide: 'Strategic Guide',
  }

  return (
    <div className="card overflow-hidden group h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-accent/20">
      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Type Badge */}
        <div className="inline-block">
          <span className="text-xs text-accent font-bold uppercase tracking-wide bg-accent/10 px-3 py-1.5 rounded-full">
            {typeLabels[product.type]}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-bold mb-3 mt-3 group-hover:text-accent transition-colors leading-tight">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Rating & Purchase Count */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => {
              const displayRating = product.rating && product.rating > 0 ? product.rating : 4.5
              return (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(displayRating)
                      ? 'fill-accent text-accent'
                      : i < displayRating
                      ? 'fill-accent text-accent opacity-50'
                      : 'text-gray-300'
                  }`}
                />
              )
            })}
            <span className="text-sm text-gray-600 ml-1">
              {product.rating && product.rating > 0 ? product.rating.toFixed(1) : '4.5'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {product.purchaseCount && product.purchaseCount > 0 ? product.purchaseCount : '100+'} purchases
          </span>
        </div>

        {/* Summary */}
        <div className="mb-4 flex-1">
          <p className="text-gray-700 leading-relaxed line-clamp-3">
            {product.summary?.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>
        </div>

        {/* File Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-t pt-4">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" /> {product.pageCount} pages
          </span>
          <span>●</span>
          <span>{product.fileFormat}</span>
          <span>●</span>
          <span>{product.fileSize}</span>
        </div>

        {/* Price & CTA */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Price</p>
              <span className="text-3xl font-bold text-primary">
                {product.currency === 'INR' ? '₹' : '$'}{product.price}
              </span>
              <span className="text-sm text-gray-500 ml-2">{product.currency}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-accent font-semibold uppercase">Instant</p>
              <p className="text-xs text-gray-500">Download</p>
            </div>
          </div>
          
          <Link
            href={`/products/${product.slug}`}
            className="btn-primary w-full text-center inline-flex items-center justify-center gap-2 group-hover:bg-accent group-hover:scale-105 transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
