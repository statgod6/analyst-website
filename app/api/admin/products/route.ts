import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helper'
import { prisma, productDataFromRequest, serializeProduct } from '@/lib/db'

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function buildWhere(status: string | null, type: string | null, search: string | null) {
  const where: any = {}
  if (status && status !== 'all') where.status = status
  if (type && type !== 'all') where.type = type
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { summary: { contains: search } },
    ]
  }
  return where
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const where = buildWhere(status, type, search)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json(
      {
        products: products.map((product: any) => serializeProduct(product, { includeFileUrl: true })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin products API error:', error)
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const body = await request.json()
    if (!body.slug) body.slug = slugify(body.name)

    const product = await prisma.product.create({ data: productDataFromRequest(body) })

    return NextResponse.json(
      { message: 'Product created successfully', product: serializeProduct(product, { includeFileUrl: true }) },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Product creation error:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'A product with this slug already exists' }, { status: 400 })
    }
    return NextResponse.json(
      { message: 'Failed to create product', error: error.message },
      { status: 500 }
    )
  }
}
