'use client'

import { Star, CheckCircle, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role: string
  company?: string
  location: string
  rating: number
  content: string
  verified: boolean
  avatar?: string
  purchasedDate?: string
}

const hardcodedTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Financial Analyst',
    company: 'ICICI Securities',
    location: 'Mumbai, India',
    rating: 5,
    content: 'This report provided invaluable insights that helped me make informed investment decisions. The depth of analysis and clarity of presentation is exceptional. Highly recommended for serious investors!',
    verified: true,
    purchasedDate: '2 weeks ago'
  },
  {
    id: 2,
    name: 'Vikram Malhotra',
    role: 'Portfolio Manager',
    company: 'BlackRock Investments',
    location: 'New York, USA',
    rating: 5,
    content: 'Outstanding research quality! The comprehensive market analysis and actionable recommendations have significantly improved my portfolio performance. Worth every penny.',
    verified: true,
    purchasedDate: '1 month ago'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Investment Advisor',
    company: 'Kotak Mahindra',
    location: 'Bangalore, India',
    rating: 5,
    content: 'The level of detail and professional presentation exceeded my expectations. This has become my go-to resource for equity research. The insights are practical and well-researched.',
    verified: true,
    purchasedDate: '3 weeks ago'
  },
  {
    id: 4,
    name: 'Arjun Mehta',
    role: 'Equity Research Analyst',
    company: 'Goldman Sachs',
    location: 'Singapore',
    rating: 5,
    content: 'Exceptional analysis backed by solid fundamentals. The report structure is professional and the insights are actionable. A must-have for anyone serious about stock market investing.',
    verified: true,
    purchasedDate: '1 week ago'
  },
  {
    id: 5,
    name: 'Anjali Desai',
    role: 'Independent Investor',
    location: 'Pune, India',
    rating: 5,
    content: 'As someone new to equity investing, this report demystified complex concepts and gave me the confidence to make my first investments. Clear, comprehensive, and incredibly valuable!',
    verified: true,
    purchasedDate: '2 months ago'
  },
  {
    id: 6,
    name: 'Karan Bhatt',
    role: 'Hedge Fund Manager',
    company: 'Citadel LLC',
    location: 'Chicago, USA',
    rating: 5,
    content: 'The quality of research and depth of market analysis is comparable to premium institutional reports. This has become an essential part of my investment research toolkit.',
    verified: true,
    purchasedDate: '3 days ago'
  }
]

export default function TestimonialsSection() {
  return (
    <div className="mt-20 bg-gradient-to-br from-blue-50 to-indigo-50 -mx-4 px-4 py-16 rounded-2xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-primary mb-4">
          Trusted by 500+ Investors Worldwide
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join thousands of satisfied clients who have transformed their investment strategies with our research
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
            <p className="text-sm text-gray-600">Based on 500+ reviews</p>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {hardcodedTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative"
          >
            {/* Quote Icon */}
            <Quote className="h-10 w-10 text-blue-100 absolute top-4 right-4" />
            
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
                    <p className="font-bold text-primary text-sm">{testimonial.name}</p>
                    {testimonial.verified && (
                      <span title="Verified Purchase">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{testimonial.role}</p>
                  {testimonial.company && (
                    <p className="text-xs text-gray-500 font-medium">{testimonial.company}</p>
                  )}
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                  {testimonial.purchasedDate && (
                    <p className="text-xs text-green-600 mt-2">Purchased {testimonial.purchasedDate}</p>
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
          <p className="text-3xl font-bold text-primary mb-1">500+</p>
          <p className="text-sm text-gray-600">Happy Clients</p>
        </div>
        <div className="text-center bg-white rounded-lg p-4 shadow">
          <p className="text-3xl font-bold text-primary mb-1">5.0</p>
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
  )
}
