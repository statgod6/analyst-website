import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helper'
import { prisma, productDataFromRequest, serializeProduct } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const product = await prisma.product.findUnique({ where: { id: params.id } })

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(
      { product: serializeProduct(product, { includeFileUrl: true }) },
      { status: 200 }
    )
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const body = await request.json()
    const product = await prisma.product.update({
      where: { id: params.id },
      data: productDataFromRequest(body),
    })

    return NextResponse.json(
      { message: 'Product updated successfully', product: serializeProduct(product, { includeFileUrl: true }) },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Product update error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'A product with this slug already exists' }, { status: 400 })
    }
    return NextResponse.json(
      { message: 'Failed to update product', error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    await prisma.product.delete({ where: { id: params.id } })

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('Product deletion error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 })
  }
}
