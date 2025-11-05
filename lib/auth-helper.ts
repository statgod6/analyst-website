import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Verify if the current user is authenticated as an admin
 * @param request - Next.js request object (optional)
 * @returns Object with isAuthenticated boolean and optional session
 */
export async function verifyAdminAuth(request?: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return {
        isAuthenticated: false,
        error: 'Not authenticated',
        status: 401,
      }
    }

    if (session.user.role !== 'admin') {
      return {
        isAuthenticated: false,
        error: 'Insufficient permissions. Admin access required.',
        status: 403,
      }
    }

    return {
      isAuthenticated: true,
      session,
      user: session.user,
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return {
      isAuthenticated: false,
      error: 'Authentication verification failed',
      status: 500,
    }
  }
}

/**
 * Middleware wrapper for admin API routes
 * Returns error response if not authenticated, otherwise returns null
 */
export async function requireAdminAuth() {
  const authResult = await verifyAdminAuth()

  if (!authResult.isAuthenticated) {
    return {
      error: true,
      message: authResult.error,
      status: authResult.status,
    }
  }

  return {
    error: false,
    user: authResult.user,
    session: authResult.session,
  }
}
