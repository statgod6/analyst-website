import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, TrendingUp, Globe, Award, Star, Sparkles, Zap, Brain, Cpu, Users, CheckCircle, Rocket } from 'lucide-react'
import NewsletterForm from '@/components/forms/NewsletterForm'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import Product from '@/models/Product'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Master AI and unlock its potential for everyone. Access AI prompts, guides, agents, and money-making strategies. Learn AI tools and techniques to boost your productivity and income.',
}

// Enable ISR with 60 second revalidation
export const revalidate = 60

async function getFeaturedBlogs() {
  try {
    await dbConnect()
    const blogs = await Blog.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(3)
      .populate('author', 'name avatar')
      .select('title slug excerpt category featuredImage readingTime')
      .lean()
    
    return blogs.map((blog: any) => ({
      _id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      category: blog.category,
      featuredImage: blog.featuredImage,
      readingTime: blog.readingTime || 5,
    }))
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

async function getFeaturedProducts() {
  try {
    await dbConnect()
    const products = await Product.find({ status: 'active' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .select('name slug summary type price currency coverImage rating')
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
      rating: product.rating || 4.5,
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function HomePage() {
  const featuredBlogs = await getFeaturedBlogs()
  const featuredProducts = await getFeaturedProducts()

  const testimonials = [
    {
      id: '1',
      content: "The AI prompts and guides have completely transformed how I work. I've automated tasks that used to take hours!",
      author: 'Priya Sharma',
      role: 'Freelance Content Creator',
    },
    {
      id: '2',
      content: 'These AI agent guides are incredibly practical. I started making money with AI within weeks of learning.',
      author: 'Rajesh Kumar',
      role: 'Digital Entrepreneur',
    },
    {
      id: '3',
      content: 'Finally, AI resources that are easy to understand and actually useful. Best investment I made this year!',
      author: 'Ananya Patel',
      role: 'Small Business Owner',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom py-20 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">AI Made Simple & Profitable</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Unlock Your <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI Potential</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Master AI tools, prompts, and automation strategies. Turn AI into your competitive advantage and start earning today.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/products" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <Rocket className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/blogs" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                Explore Guides
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>1000+ AI Resources</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { number: '10K+', label: 'Happy Users', icon: Users },
              { number: '500+', label: 'AI Resources', icon: Cpu },
              { number: '98%', label: 'Success Rate', icon: TrendingUp },
              { number: '24/7', label: 'AI Support', icon: Zap },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">AI Mastery</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Learn to use ChatGPT, Claude, Midjourney, and cutting-edge AI tools like a pro. Master prompt engineering and automation.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Make Money</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Discover proven strategies to monetize AI. Freelancing, content creation, automation services, and passive income methods.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Premium Prompts</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Access 1000+ battle-tested AI prompts for content, marketing, coding, and business automation. Save hours every day.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Cpu className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">AI Agents</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Build intelligent AI agents that work 24/7. Automate customer service, content creation, and business processes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Latest AI Insights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay ahead with the latest AI trends, tips, and practical guides to master artificial intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredBlogs.length > 0 ? (
              featuredBlogs.map((blog: any) => (
                <article key={blog._id} className="card overflow-hidden group">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {blog.featuredImage ? (
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        quality={85}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20"></div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-accent font-semibold mb-2">{blog.category}</div>
                    <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                      <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{blog.readingTime || 5} min read</span>
                      <Link 
                        href={`/blogs/${blog.slug}`}
                        className="text-primary font-semibold hover:text-accent transition-colors inline-flex items-center"
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No blogs available yet. Check back soon!</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/blogs" className="btn-primary">
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full px-4 py-2 mb-4">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Trusted Worldwide</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">
              Who We <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Empower</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From students to CEOs, we help everyone unlock AI's potential and stay ahead in the digital age.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Researchers */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300"></div>
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Researchers</h3>
                <p className="text-gray-600 leading-relaxed">
                  Accelerate research with AI-powered data analysis, literature reviews, and automated documentation.
                </p>
              </div>
            </div>

            {/* Teachers */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300"></div>
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Teachers & Educators</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create engaging lessons, personalized learning materials, and automate grading with AI assistance.
                </p>
              </div>
            </div>

            {/* Students */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300"></div>
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-green-300 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Students</h3>
                <p className="text-gray-600 leading-relaxed">
                  Master AI tools for studying, research, projects, and career preparation. Learn smarter, not harder.
                </p>
              </div>
            </div>

            {/* Industry Professionals */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300"></div>
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-300 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Industry Professionals</h3>
                <p className="text-gray-600 leading-relaxed">
                  Stay competitive with AI automation, data insights, and workflow optimization for your industry.
                </p>
              </div>
            </div>

            {/* Small & Medium Businesses */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300"></div>
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Small & Medium Businesses</h3>
                <p className="text-gray-600 leading-relaxed">
                  Scale operations, reduce costs, and compete with enterprise-level AI solutions tailored for SMBs.
                </p>
              </div>
            </div>

            {/* Content Creators */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300"></div>
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-pink-300 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Content Creators</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create viral content 10x faster. AI-powered writing, video scripts, social media, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Premium AI Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get access to premium AI prompts, agent guides, and money-making blueprints.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 3).map((product: any) => (
                <div key={product._id} className="card overflow-hidden group">
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                    {product.coverImage ? (
                      <Image
                        src={product.coverImage}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        quality={85}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20"></div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-accent font-semibold mb-2 uppercase">{product.type}</div>
                    <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.summary}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
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

                    <div className="flex items-center justify-between mb-4 pb-4 border-t pt-4">
                      <div className="text-2xl font-bold text-primary">
                        {product.currency === 'INR' ? '₹' : '$'}{product.price}
                      </div>
                      <span className="text-sm text-gray-500">{product.currency}</span>
                    </div>
                    
                    <Link href={`/products/${product.slug}`} className="btn-primary w-full text-center">
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No products available yet. Check back soon!</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/products" className="btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">Trusted by Thousands</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See how people are transforming their lives with AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-200 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="section-padding relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Join 10,000+ AI Enthusiasts</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get Weekly AI Insights
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Free prompts, tutorials, and money-making strategies delivered to your inbox every week.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm variant="light" />
            </div>
            <p className="text-sm text-gray-200 mt-4">No spam. Unsubscribe anytime. 100% free.</p>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-75 blur-xl group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-20"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                    <Rocket className="h-4 w-4" />
                    <span className="text-sm font-medium">Let's Work Together</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Ready to Master AI?
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Have questions? Need custom AI solutions? Let's connect and transform your workflow together.
                  </p>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                    Get in Touch
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
