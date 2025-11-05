import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'analyst-website/blogs',
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 630, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })

    return NextResponse.json(
      {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { message: 'No public ID provided' },
        { status: 400 }
      )
    }

    await cloudinary.uploader.destroy(publicId)

    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { message: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
