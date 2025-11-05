'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, Download, RefreshCw, Headphones, Award, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: '100% Secure',
      description: 'SSL Encrypted Payment',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Download,
      title: 'Instant Access',
      description: 'Download Immediately',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Lock,
      title: 'Privacy Protected',
      description: 'Your Data is Safe',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: RefreshCw,
      title: '7-Day Guarantee',
      description: 'Money Back Promise',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always Here to Help',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Professional Research',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-8">
      {badges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <div
            key={index}
            className={`${badge.bgColor} rounded-lg p-4 text-center hover:scale-105 transition-transform duration-300`}
          >
            <Icon className={`h-8 w-8 ${badge.color} mx-auto mb-2`} />
            <p className="text-sm font-bold text-gray-900 mb-1">{badge.title}</p>
            <p className="text-xs text-gray-600">{badge.description}</p>
          </div>
        )
      })}
    </div>
  )
}

export function GuaranteeBanner() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 my-8">
      <div className="flex items-start gap-4">
        <div className="bg-green-600 rounded-full p-3 flex-shrink-0">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            7-Day Money-Back Guarantee
          </h3>
          <p className="text-gray-700 leading-relaxed">
            We stand behind the quality of our research. If you're not completely satisfied with your purchase, 
            we'll refund 100% of your money within 7 days, no questions asked. Your satisfaction is our priority.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Risk-Free Purchase</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Full Refund Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">No Hassle Process</span>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/terms" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 underline"
            >
              Read Full Refund Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UrgencyIndicator({ purchaseCount }: { purchaseCount: number }) {
  // Use state to ensure values are only generated on client side
  const [viewingNow, setViewingNow] = useState(0)
  const [recentPurchases, setRecentPurchases] = useState(0)
  const [minutesAgo, setMinutesAgo] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Generate random values only on client side
    setViewingNow(Math.floor(Math.random() * 18) + 8) // 8-25 range
    setRecentPurchases(Math.floor(Math.random() * 13) + 3) // 3-15 range
    setMinutesAgo(Math.floor(Math.random() * 29) + 2) // 2-30 range
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-red-600 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-900 mb-1">
              🔥 High Demand Alert
            </p>
            <p className="text-xs text-red-700">
              Loading...
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <Clock className="h-5 w-5 text-red-600 animate-pulse" />
        <div className="flex-1">
          <p className="text-sm font-bold text-red-900 mb-1">
            🔥 High Demand Alert
          </p>
          <p className="text-xs text-red-700">
            <span className="font-semibold">{viewingNow} people</span> are viewing this right now • 
            <span className="font-semibold">{recentPurchases} recent purchases</span> • 
            Last purchase <span className="font-semibold">{minutesAgo} minutes ago</span>
          </p>
        </div>
      </div>
    </div>
  )
}
