import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

// GET /api/products/[slug] - Get single product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect()

    const product = await Product.findOne({
      slug: params.slug,
      status: 'active',
    }).select('-fileUrl') // Don't expose file URL to public

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product }, { status: 200 })
  } catch (error) {
    console.error('Product API error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
