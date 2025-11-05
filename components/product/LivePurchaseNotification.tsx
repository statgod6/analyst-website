'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, X } from 'lucide-react'

interface PurchaseNotification {
  id: number
  name: string
  location: string
  productName: string
  timeAgo: string
}

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai',
  'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna',
  'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
  'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad'
]

const names = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh',
  'Anjali Desai', 'Rahul Verma', 'Pooja Iyer', 'Arjun Nair', 'Kavita Gupta',
  'Sanjay Joshi', 'Neha Kapoor', 'Karan Malhotra', 'Ritu Agarwal', 'Aditya Shah',
  'Divya Rao', 'Manish Kulkarni', 'Shruti Menon', 'Rohan Bhat', 'Simran Kaur',
  'Nitin Chopra', 'Megha Pillai', 'Gaurav Bansal', 'Ananya Saxena', 'Vishal Mehta',
  'Ishita Dubey', 'Siddharth Pandey', 'Tanvi Jain', 'Aarav Sinha', 'Diya Krishnan'
]

export default function LivePurchaseNotification({ productName }: { productName: string }) {
  const [notification, setNotification] = useState<PurchaseNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const generateNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)]
      const randomCity = cities[Math.floor(Math.random() * cities.length)]
      const timeOptions = ['2 minutes ago', '5 minutes ago', '8 minutes ago', '12 minutes ago', '15 minutes ago']
      const randomTime = timeOptions[Math.floor(Math.random() * timeOptions.length)]

      return {
        id: Date.now(),
        name: randomName,
        location: randomCity,
        productName: productName,
        timeAgo: randomTime
      }
    }

    const showNotification = () => {
      const newNotification = generateNotification()
      setNotification(newNotification)
      setIsVisible(true)

      // Auto hide after 6 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 6000)
    }

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(() => {
      showNotification()
    }, 3000)

    // Then show notifications every 15-25 seconds
    const interval = setInterval(() => {
      showNotification()
    }, Math.random() * 10000 + 15000) // Random between 15-25 seconds

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [productName])

  if (!notification || !isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 pr-12 max-w-sm relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
            <ShoppingBag className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {notification.name} from {notification.location}
            </p>
            <p className="text-xs text-gray-600 mb-2">
              just purchased this product
            </p>
            <p className="text-xs text-gray-500">
              {notification.timeAgo}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
