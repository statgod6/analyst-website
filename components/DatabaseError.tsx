'use client'

import { AlertCircle, Database, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function DatabaseError() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center section-padding">
      <div className="max-w-2xl w-full">
        <div className="card p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <Database className="h-8 w-8 text-yellow-600" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">
            Database Connection Required
          </h2>
          
          <p className="text-lg text-gray-700 mb-6">
            This page requires a MongoDB database connection to display content.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-semibold text-gray-900">Why am I seeing this?</p>
                <p>
                  The MongoDB Atlas database is currently unreachable. This is likely because:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Your IP address needs to be whitelisted in MongoDB Atlas</li>
                  <li>The database connection string needs to be configured</li>
                  <li>Network connectivity issues</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-left bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm">1</span>
                Fix MongoDB Atlas IP Whitelist
              </h3>
              <ol className="text-sm text-gray-700 space-y-2 ml-8">
                <li>1. Go to <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline inline-flex items-center gap-1">MongoDB Atlas <ExternalLink className="h-3 w-3" /></a></li>
                <li>2. Select your cluster → Network Access</li>
                <li>3. Click "Add IP Address"</li>
                <li>4. Click "Allow Access from Anywhere" (for development)</li>
                <li>5. Click "Confirm"</li>
                <li>6. Wait 1-2 minutes for changes to apply</li>
                <li>7. Refresh this page</li>
              </ol>
            </div>

            <div className="text-left bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm">2</span>
                Alternative: Use Test Credentials
              </h3>
              <p className="text-sm text-gray-700 ml-8">
                You can still access the admin panel using test credentials that don't require a database:
              </p>
              <div className="mt-3 ml-8">
                <Link href="/admin/login" className="btn-primary inline-block">
                  Go to Admin Login
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Link href="/" className="text-accent hover:text-primary font-semibold">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
