import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { requireAdminAuth } from '@/lib/auth-helper'
import { blogDataFromRequest, normalizeEmail, prisma, serializeBlog } from '@/lib/db'

const categoryMap: { [key: string]: string } = {
  'ai-tools-platforms': 'AI Tools & Platforms',
  'ai-prompts-techniques': 'AI Prompts & Techniques',
  'ai-automation': 'AI Automation',
  'ai-money-making': 'AI Money Making',
  'ai-agents': 'AI Agents',
  'chatgpt-llms': 'ChatGPT & LLMs',
  'ai-for-business': 'AI for Business',
  'ai-guides-tutorials': 'AI Guides & Tutorials',
}

function buildBlogWhere(category: string | null, search: string | null, includeDrafts = false) {
  const where: any = includeDrafts ? {} : { status: 'published' }

  if (category) {
    where.category = categoryMap[category] || category
  }

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
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const where = buildBlogWhere(category, search)

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: { author: { select: { id: true, name: true, avatar: true, email: true, createdAt: true, updatedAt: true } } },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ])

    return NextResponse.json(
      {
        blogs: blogs.map(serializeBlog),
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
    console.error('Blogs API error:', error)
    return NextResponse.json({ message: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) {
      return NextResponse.json({ message: auth.message }, { status: auth.status })
    }

    const body = await request.json()
    let authorId = body.author || body.authorId

    if (!authorId || !(await prisma.user.findUnique({ where: { id: authorId } }))) {
      const email = normalizeEmail(process.env.ADMIN_EMAIL || 'admin@test.com')
      const password = process.env.ADMIN_PASSWORD || 'admin123'
      const hashedPassword = await bcrypt.hash(password, 10)
      const defaultAdmin = await prisma.user.upsert({
        where: { email },
        update: { name: 'Abhinav', role: 'admin' },
        create: { name: 'Abhinav', email, password: hashedPassword, role: 'admin' },
      })
      authorId = defaultAdmin.id
    }

    let slug = body.slug
    let counter = 1
    while (await prisma.blog.findUnique({ where: { slug } })) {
      slug = `${body.slug}-${counter}`
      counter++
    }

    const blog = await prisma.blog.create({
      data: { ...blogDataFromRequest({ ...body, slug }), authorId },
      include: { author: true },
    })

    return NextResponse.json(
      { message: 'Blog created successfully', blog: serializeBlog(blog) },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create blog error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create blog' },
      { status: 500 }
    )
  }
}
