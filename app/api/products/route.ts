import { NextRequest, NextResponse } from 'next/server'
import { prisma, serializeProduct } from '@/lib/db'

export const dynamic = 'force-dynamic'

function buildProductWhere(type: string | null, search: string | null, includeInactive = false) {
  const where: any = includeInactive ? {} : { status: 'active' }

  if (type && type !== 'all') {
    where.type = type
  }

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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const where = buildProductWhere(type, search)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json(
      {
        products: products.map(product => serializeProduct(product)),
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
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 })
  }
}
