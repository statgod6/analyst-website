import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { requireAdminAuth } from '@/lib/auth-helper'

// GET /api/admin/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product }, { status: 200 })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Set publishedAt if status changes to active
    if (body.status === 'active' && !body.publishedAt) {
      body.publishedAt = new Date()
    }

    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Product updated successfully', product },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Product update error:', error)

    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'A product with this slug already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to update product', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
