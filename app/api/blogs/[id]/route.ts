import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { requireAdminAuth } from '@/lib/auth-helper'

// GET single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const blog = await Blog.findById(params.id).populate('author', 'name email')

    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ blog }, { status: 200 })
  } catch (error) {
    console.error('Get blog error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// PUT - Update blog
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
    
    // Check if slug is being changed and ensure uniqueness
    if (body.slug) {
      const existingBlog = await Blog.findOne({ 
        slug: body.slug, 
        _id: { $ne: params.id } 
      })
      
      if (existingBlog) {
        return NextResponse.json(
          { message: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    const blog = await Blog.findByIdAndUpdate(
      params.id,
      { 
        ...body,
        metaTitle: body.metaTitle || body.title,
      },
      { new: true, runValidators: true }
    )

    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Blog updated successfully', blog },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Update blog error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog
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

    const blog = await Blog.findByIdAndDelete(params.id)

    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Blog deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete blog error:', error)
    return NextResponse.json(
      { message: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
