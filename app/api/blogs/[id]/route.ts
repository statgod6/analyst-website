import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helper'
import { blogDataFromRequest, prisma, serializeBlog } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
      include: { author: true },
    })

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ blog: serializeBlog(blog) }, { status: 200 })
  } catch (error) {
    console.error('Get blog error:', error)
    return NextResponse.json({ message: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) {
      return NextResponse.json({ message: auth.message }, { status: auth.status })
    }

    const body = await request.json()

    if (body.slug) {
      const existingBlog = await prisma.blog.findFirst({
        where: { slug: body.slug, NOT: { id: params.id } },
      })

      if (existingBlog) {
        return NextResponse.json({ message: 'Slug already exists' }, { status: 400 })
      }
    }

    const blog = await prisma.blog.update({
      where: { id: params.id },
      data: blogDataFromRequest(body),
      include: { author: true },
    })

    return NextResponse.json(
      { message: 'Blog updated successfully', blog: serializeBlog(blog) },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Update blog error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
    }
    return NextResponse.json(
      { message: error.message || 'Failed to update blog' },
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
    if (auth.error) {
      return NextResponse.json({ message: auth.message }, { status: auth.status })
    }

    await prisma.blog.delete({ where: { id: params.id } })

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('Delete blog error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Failed to delete blog' }, { status: 500 })
  }
}
