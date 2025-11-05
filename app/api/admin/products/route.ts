import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { requireAdminAuth } from '@/lib/auth-helper'

// GET /api/admin/products - Get all products (including inactive)
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
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const query: any = {}

    if (status && status !== 'all') {
      query.status = status
    }

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
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('name type price status purchaseCount rating slug createdAt updatedAt')

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
    console.error('Admin products API error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
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

    const body = await request.json()

    // Generate slug from name if not provided
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Set publishedAt if status is active
    if (body.status === 'active' && !body.publishedAt) {
      body.publishedAt = new Date()
    }

    const product = await Product.create(body)

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Product creation error:', error)
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'A product with this slug already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to create product', error: error.message },
      { status: 500 }
    )
  }
}
