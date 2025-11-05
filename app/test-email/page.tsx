'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle, XCircle } from 'lucide-react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [type, setType] = useState<'confirmation' | 'receipt'>('confirmation')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, email }),
      })

      const data = await response.json()

      if (data.success) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, message: data.message || 'Failed to send email' })
      }
    } catch (error: any) {
      setResult({ success: false, message: error.message || 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Test Email System</h1>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>⚠️ Important:</strong> Before testing, make sure you've added your Resend API key to <code className="bg-blue-100 px-2 py-1 rounded">.env.local</code>
            </p>
            <p className="text-sm text-blue-700 mt-2">
              Get your API key from: <a href="https://resend.com/api-keys" target="_blank" className="underline">https://resend.com/api-keys</a>
            </p>
          </div>

          <form onSubmit={handleSendTest} className="space-y-6">
            {/* Email Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('confirmation')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    type === 'confirmation'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">Order Confirmation</p>
                  <p className="text-sm text-gray-600 mt-1">Sent after payment</p>
                </button>
                <button
                  type="button"
                  onClick={() => setType('receipt')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    type === 'receipt'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">Receipt Email</p>
                  <p className="text-sm text-gray-600 mt-1">Order receipt details</p>
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="test@example.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                The email will be sent to this address
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Test Email
                </>
              )}
            </button>
          </form>

          {/* Result Message */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg border-2 ${
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <p
                    className={`font-semibold ${
                      result.success ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {result.success ? 'Success!' : 'Error'}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.success && (
                    <p className="text-sm text-green-600 mt-2">
                      ✅ Check your inbox (and spam folder) for the test email
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">📝 Setup Instructions:</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>Get your Resend API key from <a href="https://resend.com" target="_blank" className="text-primary underline">resend.com</a></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>Add to <code className="bg-gray-200 px-2 py-0.5 rounded">.env.local</code>:</span>
              </li>
              <li className="ml-6 bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                RESEND_API_KEY=re_your_actual_api_key_here
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>Restart your dev server</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>Test emails will be sent from: <code className="bg-gray-200 px-2 py-0.5 rounded">onboarding@resend.dev</code></span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
