import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Star, Check, ShieldCheck } from 'lucide-react'
import CheckoutButton from '@/components/product/CheckoutButton'
import LivePurchaseNotification from '@/components/product/LivePurchaseNotification'
import TestimonialsSection from '@/components/product/TestimonialsSection'
import TrustBadges, { GuaranteeBanner, UrgencyIndicator } from '@/components/product/TrustBadges'
import SocialProofStats from '@/components/product/SocialProofStats'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import FAQSection from '@/components/product/FAQSection'
import Script from 'next/script'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

interface ProductDoc {
  _id: any
  name: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  summary?: string
  description: string
  type: string
  price: number
  currency: string
  coverImage: string
  previewImages: string[]
  rating?: number
  purchaseCount?: number
  valuePropositions: string[]
  features?: string[]
  targetAudience?: string[]
  pageCount?: number
  fileFormat?: string
  fileSize?: string
  testimonials?: any[]
}


// Enable ISR with 60 second revalidation
export const revalidate = 60

async function getProductBySlug(slug: string) {
  try {
    await dbConnect()
    const product: ProductDoc | null = (await Product.findOne({ slug, status: 'active' }).lean()) as any

    if (!product) {
      return null
    }

    return {
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      summary: product.summary,
      description: product.description,
      type: product.type,
      price: product.price,
      currency: product.currency,
      coverImage: product.coverImage,
      previewImages: product.previewImages,
      rating: product.rating,
      purchaseCount: product.purchaseCount,
      valuePropositions: product.valuePropositions,
      features: product.features,
      targetAudience: product.targetAudience,
      pageCount: product.pageCount,
      fileFormat: product.fileFormat,
      fileSize: product.fileSize,
      testimonials: product.testimonials,
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.summary,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.summary,
      type: 'website',
      images: [product.coverImage],
    },
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const purchaseCount = (product.purchaseCount ?? 0) as number
  const rating = (product.rating ?? 4.5) as number

  return (
    <>
      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Live Purchase Notification */}
      <LivePurchaseNotification productName={product.name} />

      {/* Breadcrumb */}
      <section className="bg-gray-50 py-3 md:py-4 border-b">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 overflow-x-auto">
            <Link href="/" className="hover:text-primary whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary whitespace-nowrap">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-8 md:py-16 lg:py-24">
        <div className="container-custom max-w-6xl">
          <Link href="/products" className="inline-flex items-center text-primary hover:text-accent mb-6 md:mb-8 font-medium text-sm md:text-base">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Product Image Gallery */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductImageGallery
                coverImage={product.coverImage}
                previewImages={product.previewImages}
                productName={product.name}
                productType={product.type}
                isBestseller={purchaseCount > 200}
              />
            </div>

            {/* Right Column - Product Details */}
            <div>
              <div className="inline-block mb-3 md:mb-4">
                <span className="text-xs md:text-sm text-white font-bold uppercase tracking-wider bg-gradient-to-r from-accent to-accent-dark px-4 py-2 rounded-full shadow-md">
                  {product.type}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 md:mb-5 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">{product.name}</span>
              </h1>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-5 md:mb-7 pb-5 md:pb-6 border-b-2 border-gray-100">
                <div className="flex items-center gap-1 md:gap-1.5 bg-amber-50 px-3 py-2 rounded-lg">
                  {[...Array(5)].map((_, i) => {
                    // Default to 4.5 rating if product.rating is 0 or undefined
                    const displayRating = product.rating && product.rating > 0 ? product.rating : 4.5
                    return (
                      <Star
                        key={i}
                        className={`h-4 w-4 md:h-5 md:w-5 ${
                          i < Math.floor(displayRating)
                            ? 'fill-amber-400 text-amber-400'
                            : i < displayRating
                            ? 'fill-amber-400 text-amber-400 opacity-50'
                            : 'text-gray-300'
                        }`}
                      />
                    )
                  })}
                  <span className="text-sm md:text-base text-gray-800 ml-2 font-bold">
                    {product.rating && product.rating > 0 ? product.rating.toFixed(1) : '4.5'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="font-semibold">100+</span>
                  <span>happy customers</span>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6 md:mb-8 p-5 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-l-4 border-accent">
                <p className="text-base md:text-lg text-gray-800 leading-relaxed font-medium">
                  {product.summary?.replace(/<[^>]*>/g, '')}
                </p>
              </div>

              {/* Urgency Indicator */}
              <UrgencyIndicator purchaseCount={purchaseCount} />

              {/* Price */}
              <div className="mb-6 md:mb-8 p-5 md:p-7 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl border-2 border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide mb-2 font-semibold">Investment</p>
                    <div className="flex items-baseline gap-2 md:gap-3">
                      <span className="text-4xl md:text-5xl font-bold text-primary">
                        {product.currency === 'INR' ? '₹' : '$'}{product.price}
                      </span>
                      <span className="text-base md:text-lg text-gray-600 font-medium">{product.currency}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs md:text-sm font-bold mb-2">
                      💎 INSTANT
                    </div>
                    <p className="text-xs text-gray-600">Access</p>
                  </div>
                </div>
                <CheckoutButton
                  productId={product._id}
                  productName={product.name}
                  price={product.price}
                  currency={product.currency}
                />
              </div>

              {/* Money-Back Guarantee */}
              <GuaranteeBanner />

              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8 p-3 md:p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] md:text-xs text-gray-700 leading-tight">Secure Payment</p>
                </div>
                <div className="text-center">
                  <Download className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] md:text-xs text-gray-700 leading-tight">Instant Download</p>
                </div>
                <div className="text-center">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] md:text-xs text-gray-700 leading-tight">{product.fileFormat}</p>
                </div>
              </div>

              {/* File Details - Redesigned */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Product Details
                </h3>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-lg md:text-2xl font-bold text-primary mb-1">{product.pageCount}</p>
                    <p className="text-xs md:text-sm text-gray-600">Pages</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-lg md:text-2xl font-bold text-primary mb-1">{product.fileFormat}</p>
                    <p className="text-xs md:text-sm text-gray-600">Format</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-lg md:text-2xl font-bold text-primary mb-1">{product.fileSize}</p>
                    <p className="text-xs md:text-sm text-gray-600">Size</p>
                  </div>
                </div>
              </div>

              {/* Value Propositions */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-serif font-bold text-primary mb-4 md:mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-accent rounded-full"></span>
                  What You'll Get
                </h3>
                <div className="bg-white border-2 border-gray-100 rounded-xl p-5 md:p-6 shadow-sm">
                  <ul className="space-y-3 md:space-y-4">
                    {product.valuePropositions.map((value: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 md:gap-4 group">
                        <div className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <Check className="h-4 w-4 md:h-4 md:w-4 text-green-600 font-bold" />
                        </div>
                        <span className="text-sm md:text-base text-gray-700 leading-relaxed pt-0.5">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Statistics */}
          <SocialProofStats purchaseCount={purchaseCount} rating={rating} />

          {/* Trust Badges */}
          <TrustBadges />

          {/* Full Description */}
          <div className="mt-12 md:mt-16">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Complete Overview</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="card p-6 md:p-10 lg:p-12">
                <div
                  className="prose prose-lg md:prose-xl max-w-none prose-headings:font-serif prose-headings:text-primary prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-ul:text-gray-700 prose-ol:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Testimonials Section */}
          {product.testimonials && product.testimonials.length > 0 ? (
            <div className="mt-20 bg-gradient-to-br from-blue-50 to-indigo-50 -mx-4 px-4 py-16 rounded-2xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-serif font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Trusted by Investors Worldwide</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  See what our customers are saying about this product
                </p>
                
                {/* Overall Rating Summary */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-accent text-accent" />
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-primary">5.0 out of 5</p>
                    <p className="text-sm text-gray-600">Based on verified reviews</p>
                  </div>
                </div>
              </div>

              {/* Testimonials Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {product.testimonials.map((testimonial: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative"
                  >
                    {/* Quote Icon */}
                    <svg className="h-10 w-10 text-blue-100 absolute top-4 right-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? 'fill-accent text-accent'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                      "{testimonial.content}"
                    </p>

                    {/* Author Info */}
                    <div className="border-t pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-primary text-sm">{testimonial.author}</p>
                            <span title="Verified Purchase">
                              <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{testimonial.role}</p>
                          {testimonial.company && (
                            <p className="text-xs text-gray-500 font-medium">{testimonial.company}</p>
                          )}
                          {testimonial.location && (
                            <p className="text-xs text-gray-500">{testimonial.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="text-center bg-white rounded-lg p-4 shadow">
                  <p className="text-3xl font-bold text-primary mb-1">{product.purchaseCount || '500+'}+</p>
                  <p className="text-sm text-gray-600">Happy Clients</p>
                </div>
                <div className="text-center bg-white rounded-lg p-4 shadow">
                  <p className="text-3xl font-bold text-primary mb-1">{product.rating || '5.0'}</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                <div className="text-center bg-white rounded-lg p-4 shadow">
                  <p className="text-3xl font-bold text-primary mb-1">98%</p>
                  <p className="text-sm text-gray-600">Satisfaction Rate</p>
                </div>
                <div className="text-center bg-white rounded-lg p-4 shadow">
                  <p className="text-3xl font-bold text-primary mb-1">24/7</p>
                  <p className="text-sm text-gray-600">Support Available</p>
                </div>
              </div>
            </div>
          ) : (
            <TestimonialsSection />
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
    </>
  )
}
