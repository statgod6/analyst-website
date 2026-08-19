'use client'

import { AlertCircle, Database } from 'lucide-react'
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
            Local Database Required
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            This page requires the local SQLite database to be initialized.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-semibold text-gray-900">Why am I seeing this?</p>
                <p>The SQLite database file may not exist yet or the schema migration has not been applied.</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Run the Prisma migration command locally.</li>
                  <li>Confirm DATABASE_URL points to the local SQLite file.</li>
                  <li>Create an admin user if the database is empty.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-left bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm">1</span>
                Initialize SQLite
              </h3>
              <ol className="text-sm text-gray-700 space-y-2 ml-8">
                <li>1. Run <code>npx prisma migrate dev</code></li>
                <li>2. Run <code>node scripts/create-admin.js</code></li>
                <li>3. Refresh this page</li>
              </ol>
            </div>

            <div className="text-left bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm">2</span>
                Admin Login
              </h3>
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
