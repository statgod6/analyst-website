import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { requireAdminAuth } from '@/lib/auth-helper'

// GET all published blogs
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build query
    const query: any = { status: 'published' }

    if (category) {
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
      query.category = categoryMap[category]
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Execute query with pagination
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name avatar')
      .select('-content') // Exclude full content, only return excerpt

    const total = await Blog.countDocuments(query)

    return NextResponse.json(
      {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Blogs API error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// POST - Create new blog (requires authentication)
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
    
    // Get or create default admin user if author is not provided or invalid
    let authorId = body.author
    
    // Check if author is a valid ObjectId
    const mongoose = require('mongoose')
    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      // Find or create a default admin user
      const User = require('@/models/User').default
      let defaultAdmin = await User.findOne({ email: 'admin@test.com' })
      
      if (!defaultAdmin) {
        // Create default admin user
        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash('admin123', 10)
        defaultAdmin = await User.create({
          name: 'Abhinav',
          email: 'admin@test.com',
          password: hashedPassword,
          role: 'admin',
        })
      } else if (defaultAdmin.name !== 'Abhinav') {
        // Update existing admin name to Abhinav
        defaultAdmin.name = 'Abhinav'
        await defaultAdmin.save()
      }
      
      authorId = defaultAdmin._id
    }
    
    // Generate unique slug if needed
    let slug = body.slug
    let slugExists = await Blog.findOne({ slug })
    let counter = 1
    
    while (slugExists) {
      slug = `${body.slug}-${counter}`
      slugExists = await Blog.findOne({ slug })
      counter++
    }
    
    const blogData = {
      ...body,
      author: authorId,
      slug,
      metaTitle: body.metaTitle || body.title,
    }
    
    const blog = await Blog.create(blogData)

    return NextResponse.json(
      { message: 'Blog created successfully', blog },
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
