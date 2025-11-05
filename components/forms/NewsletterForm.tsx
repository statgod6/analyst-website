'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

interface NewsletterFormProps {
  variant?: 'light' | 'dark'
}

export default function NewsletterForm({ variant = 'dark' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Successfully subscribed!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }

    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  const inputClass = variant === 'light' 
    ? 'w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-gray-900'
    : 'w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-gray-900 placeholder-gray-500 focus:border-accent focus:outline-none'

  const buttonClass = variant === 'light'
    ? 'w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-all duration-200'
    : 'w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accent-dark text-primary rounded-lg font-semibold transition-all duration-200'

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${variant === 'light' ? 'text-gray-400' : 'text-white/60'}`} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`${inputClass} pl-11`}
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={buttonClass}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {message && (
        <p className={`mt-3 text-sm ${
          status === 'success' 
            ? variant === 'light' ? 'text-green-600' : 'text-green-300'
            : variant === 'light' ? 'text-red-600' : 'text-red-300'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}
