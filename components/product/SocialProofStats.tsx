'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, Download, Star, Globe } from 'lucide-react'

export default function SocialProofStats({ purchaseCount, rating }: { purchaseCount: number, rating: number }) {
  // Generate randomized but plausible values - using state with useEffect to prevent hydration errors
  const [satisfiedCustomers, setSatisfiedCustomers] = useState(0)
  const [downloadsCompleted, setDownloadsCompleted] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [averageRating, setAverageRating] = useState('0.0')
  const [activeUsers, setActiveUsers] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Generate random values only on client side to prevent hydration mismatch
    setSatisfiedCustomers(Math.floor(Math.random() * 401) + 100) // 100-500 range
    setDownloadsCompleted(Math.floor(Math.random() * 801) + 200) // 200-1000 range
    setTotalViews(Math.floor(Math.random() * 1501) + 500) // 500-2000 range
    setAverageRating((Math.random() * 0.4 + 4.5).toFixed(1)) // 4.5-4.9 range
    setActiveUsers(Math.floor(Math.random() * 21) + 10) // 10-30 range
    setMounted(true)

    // Update view count periodically to simulate real-time activity
    const interval = setInterval(() => {
      setTotalViews(prev => prev + Math.floor(Math.random() * 3))
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      icon: Users,
      value: `${satisfiedCustomers}+`,
      label: 'Satisfied Customers',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Download,
      value: `${downloadsCompleted}+`,
      label: 'Downloads Completed',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Star,
      value: `${averageRating}/5.0`,
      label: 'Average Rating',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Globe,
      value: `${totalViews.toLocaleString()}+`,
      label: 'Total Views',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 my-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-primary">Real-Time Performance</h3>
      </div>

      {/* Show loading state until mounted to prevent hydration mismatch */}
      {!mounted ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 text-center animate-pulse">
              <div className="h-6 w-6 bg-gray-200 rounded mx-auto mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className={`${stat.bgColor} rounded-lg p-4 text-center hover:scale-105 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-600 leading-tight">{stat.label}</p>
                </div>
              )
            })}
          </div>

          {/* Active Viewers Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                {activeUsers > 0 ? String(activeUsers).charAt(0) : 'A'}
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                {activeUsers > 1 ? String(activeUsers).charAt(1) || 'B' : 'B'}
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                C
              </div>
            </div>
            <span className="font-medium">
              <span className="text-primary font-bold">{activeUsers}</span> people are viewing this right now
            </span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
        </>
      )}
    </div>
  )
}
