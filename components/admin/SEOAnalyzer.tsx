'use client'

import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react'

interface SEOAnalyzerProps {
  title: string
  metaTitle: string
  metaDescription: string
  slug: string
  content: string
  keywords: string[]
  imageAlt: string
}

interface SEOCheck {
  label: string
  status: 'good' | 'warning' | 'error' | 'info'
  message: string
}

export default function SEOAnalyzer({
  title,
  metaTitle,
  metaDescription,
  slug,
  content,
  keywords,
  imageAlt
}: SEOAnalyzerProps) {
  const checks: SEOCheck[] = []

  // Meta Title Check
  const titleLength = metaTitle.length || title.length
  if (titleLength === 0) {
    checks.push({
      label: 'Meta Title',
      status: 'error',
      message: 'Meta title is missing'
    })
  } else if (titleLength < 30) {
    checks.push({
      label: 'Meta Title',
      status: 'warning',
      message: `Meta title is too short (${titleLength}/60 characters)`
    })
  } else if (titleLength > 60) {
    checks.push({
      label: 'Meta Title',
      status: 'warning',
      message: `Meta title is too long (${titleLength}/60 characters)`
    })
  } else {
    checks.push({
      label: 'Meta Title',
      status: 'good',
      message: `Meta title length is optimal (${titleLength}/60 characters)`
    })
  }

  // Meta Description Check
  const descLength = metaDescription.length
  if (descLength === 0) {
    checks.push({
      label: 'Meta Description',
      status: 'error',
      message: 'Meta description is missing'
    })
  } else if (descLength < 120) {
    checks.push({
      label: 'Meta Description',
      status: 'warning',
      message: `Meta description is too short (${descLength}/160 characters)`
    })
  } else if (descLength > 160) {
    checks.push({
      label: 'Meta Description',
      status: 'warning',
      message: `Meta description is too long (${descLength}/160 characters)`
    })
  } else {
    checks.push({
      label: 'Meta Description',
      status: 'good',
      message: `Meta description length is optimal (${descLength}/160 characters)`
    })
  }

  // Slug Check
  if (!slug) {
    checks.push({
      label: 'URL Slug',
      status: 'error',
      message: 'URL slug is missing'
    })
  } else if (slug.length > 75) {
    checks.push({
      label: 'URL Slug',
      status: 'warning',
      message: 'URL slug is too long (keep it under 75 characters)'
    })
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    checks.push({
      label: 'URL Slug',
      status: 'warning',
      message: 'URL slug should only contain lowercase letters, numbers, and hyphens'
    })
  } else {
    checks.push({
      label: 'URL Slug',
      status: 'good',
      message: 'URL slug is SEO-friendly'
    })
  }

  // Keywords Check
  if (keywords.length === 0) {
    checks.push({
      label: 'Focus Keywords',
      status: 'warning',
      message: 'No focus keywords added'
    })
  } else if (keywords.length < 3) {
    checks.push({
      label: 'Focus Keywords',
      status: 'info',
      message: `${keywords.length} keyword${keywords.length > 1 ? 's' : ''} added (3-5 recommended)`
    })
  } else if (keywords.length > 5) {
    checks.push({
      label: 'Focus Keywords',
      status: 'warning',
      message: `${keywords.length} keywords added (3-5 recommended for best results)`
    })
  } else {
    checks.push({
      label: 'Focus Keywords',
      status: 'good',
      message: `${keywords.length} keywords added (optimal range)`
    })
  }

  // Content Length Check
  const contentLength = content.replace(/<[^>]*>/g, '').length
  if (contentLength < 300) {
    checks.push({
      label: 'Content Length',
      status: 'error',
      message: `Content is too short (${contentLength} characters). Aim for at least 800 words.`
    })
  } else if (contentLength < 1600) {
    checks.push({
      label: 'Content Length',
      status: 'warning',
      message: `Content length is acceptable but could be longer (${contentLength} characters)`
    })
  } else {
    checks.push({
      label: 'Content Length',
      status: 'good',
      message: `Content length is good (${contentLength} characters)`
    })
  }

  // Image Alt Text Check
  if (!imageAlt) {
    checks.push({
      label: 'Image Alt Text',
      status: 'warning',
      message: 'Featured image is missing alt text'
    })
  } else {
    checks.push({
      label: 'Image Alt Text',
      status: 'good',
      message: 'Featured image has alt text'
    })
  }

  // Heading Structure Check
  const hasH1 = content.includes('<h1')
  const hasH2 = content.includes('<h2')
  
  if (!hasH1 && !hasH2) {
    checks.push({
      label: 'Heading Structure',
      status: 'warning',
      message: 'No headings found in content. Use H2 and H3 tags to structure your content.'
    })
  } else {
    checks.push({
      label: 'Heading Structure',
      status: 'good',
      message: 'Content includes proper heading structure'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const goodCount = checks.filter(c => c.status === 'good').length
  const totalChecks = checks.length
  const score = Math.round((goodCount / totalChecks) * 100)

  return (
    <div className="space-y-4">
      {/* SEO Score */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-accent rounded-lg text-white">
        <div>
          <h3 className="text-lg font-semibold">SEO Score</h3>
          <p className="text-sm opacity-90">{goodCount} of {totalChecks} checks passed</p>
        </div>
        <div className="text-4xl font-bold">{score}%</div>
      </div>

      {/* SEO Checks */}
      <div className="space-y-2">
        {checks.map((check, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(check.status)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{check.label}</p>
              <p className="text-sm text-gray-600">{check.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
