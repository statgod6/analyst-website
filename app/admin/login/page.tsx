'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      console.log('Sign in result:', result)

      if (result?.error) {
        setError(result.error === 'CredentialsSignin' 
          ? 'Invalid email or password' 
          : result.error)
      } else if (result?.ok) {
        // Successful login - redirect to dashboard
        console.log('Login successful, redirecting...')
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        setError('An unexpected error occurred')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo/Branding */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
            <div className="relative h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/50 transform hover:scale-110 transition-transform duration-300">
              <span className="text-5xl font-serif font-extrabold text-white">S</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200 mb-3 animate-fade-in">
            Admin Portal
          </h1>
          <p className="text-lg text-blue-200/80 font-medium">
            Business & Political Analysis Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-8 md:p-10 border border-white/20 hover:shadow-blue-500/20 transition-shadow duration-500">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Enter your credentials to access the dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl flex items-start gap-3 animate-shake shadow-lg shadow-red-200/50">
              <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-red-900 text-sm">Authentication Failed</p>
                <p className="text-red-700 text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="group">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full group-focus-within:scale-150 transition-transform"></span>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full group-focus-within:scale-150 transition-transform"></span>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-indigo-600 transition-colors underline decoration-2 underline-offset-2 hover:decoration-indigo-600">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-lg py-5 px-8 rounded-xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-600/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              
              <span className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span>Sign In to Dashboard</span>
                    <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-gray-600">
                Need access?{' '}
                <a href="/contact" className="text-blue-600 hover:text-indigo-600 font-bold underline decoration-2 underline-offset-2 hover:decoration-indigo-600 transition-colors">
                  Contact Admin
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-blue-100 text-sm font-medium">
              🔒 Secure SSL Connection
            </p>
          </div>
          <p className="text-blue-200/60 text-xs">
            Protected area • Authorized access only
          </p>
        </div>
      </div>
    </div>
  )
}
