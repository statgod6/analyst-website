import { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingCart, Download, FileText, BookOpen, Award } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export const metadata: Metadata = {
  title: 'AI Prompts & Guides | Premium AI Resources',
  description: 'Download premium AI prompts, agent guides, automation blueprints, and money-making strategies. Instant access to AI resources.',
  keywords: ['AI prompts', 'AI guides', 'AI agents', 'AI automation', 'AI money making', 'ChatGPT prompts'],
}

// Enable ISR with 60 second revalidation
export const revalidate = 60

async function getProducts() {
  try {
    await dbConnect()
    const products = await Product.find({ status: 'active' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(100)
      .select('-fileUrl')
      .lean()

    return products.map((product: any) => ({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      summary: product.summary,
      type: product.type,
      price: product.price,
      currency: product.currency,
      coverImage: product.coverImage,
      rating: product.rating,
      purchaseCount: product.purchaseCount,
      valuePropositions: product.valuePropositions,
      pageCount: product.pageCount,
      fileFormat: product.fileFormat,
      fileSize: product.fileSize,
      status: product.status,
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

const productTypes = [
  { name: 'All Resources', value: 'all', icon: ShoppingCart },
  { name: 'AI Prompts', value: 'ai-prompts', icon: FileText },
  { name: 'AI Guides', value: 'ai-guides', icon: BookOpen },
  { name: 'AI Agents', value: 'ai-agents', icon: Download },
  { name: 'AI Automation', value: 'ai-automation', icon: Award },
  { name: 'AI Templates', value: 'ai-templates', icon: FileText },
]

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Premium AI Resources
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Professional AI prompts, guides, and automation blueprints to accelerate your success
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Download className="h-4 w-4" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <FileText className="h-4 w-4" />
              <span>PDF Format</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Award className="h-4 w-4" />
              <span>Ready to Use</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Type Filter */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {productTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.value}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-all duration-200 font-medium"
                >
                  <Icon className="h-5 w-5" />
                  {type.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Why Choose Our AI Resources?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Proven & Tested</h3>
              <p className="text-gray-600">
                All AI prompts and guides are tested and proven to work. Get results from day one with battle-tested resources.
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Actionable & Practical</h3>
              <p className="text-gray-600">
                Every resource includes step-by-step instructions and real-world examples you can use immediately.
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Instant Access</h3>
              <p className="text-gray-600">
                Download your purchase immediately after payment. No waiting, no shipping fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-12 text-center">
            What Our Users Say
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8">
              <div className="flex items-center gap-1 text-accent mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The AI Prompts Library saved me hours of work. These prompts are incredibly well-crafted and deliver amazing results with ChatGPT!"
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-primary">Jessica Lee</p>
                <p className="text-sm text-gray-600">Content Creator & Freelancer</p>
              </div>
            </div>
            
            <div className="card p-8">
              <div className="flex items-center gap-1 text-accent mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The AI Money-Making Blueprint is pure gold! I started making $500/week within 2 weeks of implementing the strategies. Best investment ever!"
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-primary">Mark Rodriguez</p>
                <p className="text-sm text-gray-600">Digital Entrepreneur</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Need Custom AI Solutions?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Looking for custom AI prompts or personalized AI consulting? We can create tailored solutions for your specific needs.
          </p>
          <Link href="/contact" className="btn-primary bg-accent hover:bg-accent-dark text-lg px-8 py-4">
            Contact for Custom Solutions
          </Link>
        </div>
      </section>
    </>
  )
}
