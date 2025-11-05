import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

// GET /api/products - Get all active products
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query - only show active products
    const query: any = { status: 'active' }

    if (type && type !== 'all') {
      query.type = type
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ]
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-fileUrl') // Don't expose file URL to public

    const total = await Product.countDocuments(query)

    return NextResponse.json(
      {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
