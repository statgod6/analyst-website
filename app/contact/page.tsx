'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Mail, Phone, MapPin, Send, Linkedin, Twitter, MessageSquare, Briefcase, Video, FileText } from 'lucide-react'
import NewsletterForm from '@/components/forms/NewsletterForm'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: '',
    budget: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [responseMessage, setResponseMessage] = useState('')

  const inquiryTypes = [
    { value: 'ai-consulting', label: 'AI Consulting & Setup', icon: Briefcase },
    { value: 'custom-prompts', label: 'Custom AI Prompts', icon: Video },
    { value: 'collaboration', label: 'Collaboration Request', icon: MessageSquare },
    { value: 'bulk-purchase', label: 'Bulk Resource Purchase', icon: FileText },
    { value: 'general', label: 'General Inquiry', icon: Mail },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setResponseMessage('Thank you for reaching out! We\'ll get back to you within 24-48 hours.')
        setFormData({
          name: '',
          email: '',
          organization: '',
          inquiryType: '',
          budget: '',
          message: '',
        })
      } else {
        setStatus('error')
        setResponseMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setResponseMessage('Failed to send message. Please try emailing directly.')
    }

    setTimeout(() => {
      setStatus('idle')
      setResponseMessage('')
    }, 8000)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Get in Touch</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Questions about AI? Need custom prompts or consultation? Let's talk!
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card p-8 text-center">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <a href="mailto:abhinem3@gmail.com" className="text-accent hover:text-primary">
                abhinem3@gmail.com
              </a>
            </div>

            <div className="card p-8 text-center">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Linkedin className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">LinkedIn</h3>
              <a 
                href="https://www.linkedin.com/in/school-of-agents/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-primary"
              >
                Connect on LinkedIn
              </a>
            </div>

            <div className="card p-8 text-center">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Twitter className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">Twitter</h3>
              <a 
                href="https://x.com/zodiac_teller" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-primary"
              >
                @zodiac_teller
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Send a Message</span>
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll respond within 24-48 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 md:p-12">
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>

            {/* Organization */}
            <div className="mb-6">
              <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-2">
                Organization
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Inquiry Type */}
            <div className="mb-6">
              <label htmlFor="inquiryType" className="block text-sm font-semibold text-gray-700 mb-2">
                Type of Inquiry *
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select inquiry type</option>
                {inquiryTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget (for consulting) */}
            {formData.inquiryType === 'ai-consulting' && (
              <div className="mb-6">
                <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget Range (Optional)
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select budget range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="over-50k">Over $50,000</option>
                </select>
              </div>
            )}

            {/* Message */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="input resize-none"
              />
            </div>

            {/* Status Message */}
            {responseMessage && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  status === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {responseMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 text-lg"
            >
              {status === 'loading' ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Message
                </>
              )}
            </button>

            <p className="text-sm text-gray-500 mt-4 text-center">
              By submitting this form, you agree to be contacted regarding your inquiry.
            </p>
          </form>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">How We Can Help</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <Briefcase className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-serif font-bold mb-3">AI Consulting & Implementation</h3>
              <p className="text-gray-600 mb-4">
                Get personalized guidance on implementing AI tools in your business or workflow for maximum productivity and ROI.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>AI tool selection and setup assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Custom AI automation workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>AI strategy and implementation planning</span>
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <FileText className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-serif font-bold mb-3">Custom AI Prompts & Templates</h3>
              <p className="text-gray-600 mb-4">
                Need specific prompts for your business or niche? We create custom, high-performing AI prompts tailored to your needs.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Industry-specific prompt engineering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Branded content templates and frameworks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>AI workflow optimization</span>
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <Video className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-serif font-bold mb-3">AI Training & Workshops</h3>
              <p className="text-gray-600 mb-4">
                Hands-on training sessions to get your team up to speed with AI tools and best practices.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Team AI skills training and workshops</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>AI productivity masterclasses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Ongoing support and coaching</span>
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <MessageSquare className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-serif font-bold mb-3">Bulk Resource Licensing</h3>
              <p className="text-gray-600 mb-4">
                License our AI guides, prompts, and resources for your organization or educational institution.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Team and enterprise licensing options</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>White-label AI resource packages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Custom bundle creation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container-custom text-center max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Stay Updated with AI</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Subscribe to receive weekly AI tips, prompts, and money-making strategies.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm variant="light" />
          </div>
        </div>
      </section>
    </>
  )
}
