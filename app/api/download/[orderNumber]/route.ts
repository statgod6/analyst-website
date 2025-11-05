import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Order from '@/models/Order'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params

    // Connect to database
    await dbConnect()

    // Find order
    const order = await Order.findOne({ orderNumber })

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify payment is completed
    if (order.paymentStatus !== 'completed') {
      return NextResponse.json(
        { message: 'Payment not completed. Cannot download product.' },
        { status: 403 }
      )
    }

    // Get product details
    const product = await Product.findById(order.productId)

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product has a file URL
    if (!product.fileUrl) {
      return NextResponse.json(
        { message: 'Product file not available. Please contact support.' },
        { status: 500 }
      )
    }

    // Update download count and last download time
    await Order.updateOne(
      { orderNumber },
      {
        $inc: { downloadCount: 1 },
        $set: { lastDownloadedAt: new Date() },
      }
    )

    // Log download for security/analytics
    console.log(`📥 Download: Order ${orderNumber} | Product: ${product.name} | Count: ${order.downloadCount + 1}`)

    // Method 1: Redirect to Cloudinary/external URL (simplest)
    if (product.fileUrl.startsWith('http')) {
      return NextResponse.redirect(product.fileUrl)
    }

    // Method 2: Stream file (if stored locally or need more control)
    // This is a placeholder - implement based on your file storage
    // For now, redirect is the safest approach

    return NextResponse.json(
      { 
        message: 'File not accessible',
        supportEmail: 'support@example.com' 
      },
      { status: 500 }
    )

  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json(
      { 
        message: 'Failed to process download',
        error: error.message 
      },
      { status: 500 }
    )
  }
}

// Alternative: For more secure, time-limited downloads
// Uncomment this if you want to generate temporary signed URLs

/*
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params
    await dbConnect()

    const order = await Order.findOne({ orderNumber })
    if (!order || order.paymentStatus !== 'completed') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const product = await Product.findById(order.productId)
    if (!product?.fileUrl) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 })
    }

    // Extract public_id from Cloudinary URL
    const publicId = extractPublicId(product.fileUrl)

    // Generate time-limited signed URL (expires in 1 hour)
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      type: 'authenticated',
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    })

    // Update download count
    await Order.updateOne(
      { orderNumber },
      { 
        $inc: { downloadCount: 1 },
        $set: { lastDownloadedAt: new Date() }
      }
    )

    return NextResponse.redirect(signedUrl)

  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json(
      { message: 'Download failed', error: error.message },
      { status: 500 }
    )
  }
}

function extractPublicId(url: string): string {
  // Extract Cloudinary public_id from URL
  // Example: https://res.cloudinary.com/demo/raw/upload/v1/sample.pdf
  // Returns: sample.pdf
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/)
  return match ? match[1] : ''
}
*/
