import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helper'
import { prisma, serializeBlog } from '@/lib/db'

export const dynamic = 'force-dynamic'

function buildWhere(status: string | null, category: string | null, search: string | null) {
  const where: any = {}
  if (status && status !== 'all') where.status = status
  if (category && category !== 'all') where.category = category
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { tags: { contains: search } },
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
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const where = buildWhere(status, category, search)

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: { author: { select: { id: true, name: true, email: true, createdAt: true, updatedAt: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ])

    return NextResponse.json(
      {
        blogs: blogs.map((blog: any) => serializeBlog(blog)),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin blogs API error:', error)
    return NextResponse.json({ message: 'Failed to fetch blogs' }, { status: 500 })
  }
}
