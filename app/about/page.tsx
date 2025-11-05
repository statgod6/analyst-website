import { Metadata } from 'next'
import Link from 'next/link'
import { Award, BookOpen, Briefcase, GraduationCap, Globe, Mail, Linkedin, Twitter, ExternalLink } from 'lucide-react'
import AuthorImage from '@/components/blog/AuthorImage'

export const metadata: Metadata = {
  title: 'About | AI Learning & Resources for Everyone',
  description: 'Learn about our mission to make AI accessible to everyone. Discover practical AI prompts, guides, and money-making strategies.',
  keywords: ['AI education', 'AI learning', 'AI for beginners', 'AI resources', 'AI guides'],
  openGraph: {
    title: 'About AI for Everyone',
    description: 'Making AI accessible and profitable for everyone with practical guides, prompts, and strategies.',
    type: 'website',
  },
}

// JSON-LD Schema for Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AI for Everyone',
  description: 'Making AI accessible and profitable for everyone through practical guides, prompts, and strategies.',
  url: 'https://yourdomain.com/about',
  sameAs: [
    'https://linkedin.com/in/yourprofile',
    'https://twitter.com/yourhandle',
  ],
  knowsAbout: [
    'Artificial Intelligence',
    'AI Prompts',
    'AI Agents',
    'AI Automation',
    'AI Money Making',
  ],
}

export default function AboutPage() {
  const expertise = [
    {
      icon: Globe,
      title: 'AI Tools & Platforms',
      description: 'Comprehensive guides on ChatGPT, Midjourney, Claude, and other cutting-edge AI platforms to maximize productivity.',
    },
    {
      icon: Briefcase,
      title: 'AI Money Making',
      description: 'Proven strategies and blueprints to monetize AI skills through freelancing, content creation, and automation services.',
    },
    {
      icon: BookOpen,
      title: 'AI Prompts Library',
      description: 'Curated collection of high-performing prompts for content creation, coding, marketing, and business automation.',
    },
    {
      icon: Award,
      title: 'AI Agents & Automation',
      description: 'Build intelligent AI agents and automated workflows to save time and scale your business operations.',
    },
  ]

  const experience = [
    {
      year: '2023 - Present',
      role: 'AI Content Creator & Educator',
      organization: 'AI for Everyone',
      description: 'Creating comprehensive AI guides, prompts, and resources to help individuals leverage AI for productivity and income.',
    },
    {
      year: '2022 - 2023',
      role: 'AI Automation Specialist',
      organization: 'Tech Innovation',
      description: 'Developed AI-powered automation solutions for businesses, saving thousands of hours in manual work.',
    },
    {
      year: '2021 - 2022',
      role: 'AI Research & Implementation',
      organization: 'Digital Solutions Lab',
      description: 'Researched and implemented AI tools for content creation, customer service, and business optimization.',
    },
  ]

  const credentials = [
    {
      icon: GraduationCap,
      title: 'AI & Machine Learning',
      institution: 'Certified AI Practitioner',
      year: '2023',
    },
    {
      icon: GraduationCap,
      title: 'Digital Marketing & Automation',
      institution: 'Advanced Digital Strategy',
      year: '2022',
    },
  ]

  const publications = [
    'The Complete ChatGPT Prompts Guide - Digital Resource (2024)',
    'AI Money-Making Blueprint - Comprehensive Guide (2024)',
    'Building AI Agents for Business - Tutorial Series (2023)',
    'AI Automation Playbook - Practical Framework (2023)',
  ]

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto mb-6 flex items-center justify-center">
              <img
                src="/images/author-abhinav.jpg"
                alt="Dr. Abhinav"
                className="h-32 w-32 rounded-full object-cover border-4 border-accent shadow-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Dr. Abhinav
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-6">
              PhD & Professor | Marketing, Analytics & AI
            </p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Empowering individuals and businesses to harness the power of AI through practical guides, proven prompts, and actionable strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Professional Background */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">
            Our Mission
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg mb-6">
              We believe AI should be accessible to everyone, not just tech experts. Our mission is to democratize AI knowledge and help people leverage these powerful tools to boost their productivity and income.
            </p>
            <p className="text-gray-700 text-lg mb-6">
              Through carefully curated prompts, step-by-step guides, and proven strategies, we help individuals and businesses unlock the full potential of AI tools like ChatGPT, Claude, Midjourney, and more.
            </p>
            <p className="text-gray-700 text-lg">
              Whether you're looking to automate tasks, create content, build AI agents, or make money with AI, we provide the practical resources you need to succeed in the AI revolution.
            </p>
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive AI resources to accelerate your learning and success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {expertise.map((area) => {
              const Icon = area.icon
              return (
                <div key={area.title} className="card p-8">
                  <div className="h-14 w-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">{area.title}</h3>
                  <p className="text-gray-600">{area.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-12">
            Our Journey
          </h2>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-accent rounded-full flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 pb-8 border-b border-gray-200 last:border-0">
                  <div className="text-sm text-accent font-semibold mb-2">{exp.year}</div>
                  <h3 className="text-xl font-serif font-bold text-primary mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-gray-600 font-medium mb-3">{exp.organization}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">
            Certifications & Learning
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {credentials.map((cred, index) => {
              const Icon = cred.icon
              return (
                <div key={index} className="card p-6">
                  <Icon className="h-8 w-8 text-accent mb-4" />
                  <h3 className="text-lg font-bold text-primary mb-2">{cred.title}</h3>
                  <p className="text-gray-700 mb-1">{cred.institution}</p>
                  <p className="text-sm text-gray-500">{cred.year}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">
            Featured Resources & Guides
          </h2>

          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-accent bg-gray-50 rounded">
                <BookOpen className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                <p className="text-gray-700">{pub}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <p className="text-gray-700">
              <strong>Current Focus:</strong> Creating comprehensive AI automation guides and advanced prompt engineering 
              resources to help businesses scale with AI while maintaining quality and authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* Media & Speaking */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">
            Community & Engagement
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-primary mb-4">Community Resources</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Free AI prompts and templates library</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Weekly AI tips and strategy newsletter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Tutorials on popular AI platforms</span>
                </li>
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-primary mb-4">Learning Topics</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>ChatGPT & Advanced Prompt Engineering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>AI Automation for Business Growth</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Making Money with AI Tools</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="card p-12 text-center bg-gradient-to-br from-gray-50 to-white">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Let's Connect
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Have questions about AI, want to collaborate, or need custom AI solutions? We'd love to hear from you!
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a
                href="https://www.linkedin.com/in/school-of-agents/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
              <a
                href="https://twitter.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                <Twitter className="h-5 w-5" />
                Twitter
              </a>
              <a
                href="mailto:contact@yourdomain.com"
                className="btn-outline inline-flex items-center gap-2"
              >
                <Mail className="h-5 w-5" />
                Email
              </a>
            </div>

            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
