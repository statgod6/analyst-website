import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { requireAdminAuth } from '@/lib/auth-helper'

// GET all blogs for admin (including drafts)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await requireAdminAuth()
    if (auth.error) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status }
      )
    }
    
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    const query: any = {}

    if (status && status !== 'all') {
      query.status = status
    }

    if (category && category !== 'all') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Execute query with pagination
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name email')
      .select('title slug category status publishedAt views readingTime createdAt updatedAt')

    const total = await Blog.countDocuments(query)

    return NextResponse.json(
      {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin blogs API error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}
