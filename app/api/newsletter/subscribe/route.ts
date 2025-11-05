import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { Schema, model, models } from 'mongoose'
import { sendNewsletterSubscriptionNotification } from '@/lib/email'

// Newsletter subscriber schema
const NewsletterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed'],
    default: 'subscribed',
  },
  source: {
    type: String,
    default: 'website',
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  unsubscribedAt: Date,
})

const Newsletter = models.Newsletter || model('Newsletter', NewsletterSchema)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: 'Email address is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Connect to database
    await dbConnect()

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email })

    if (existingSubscriber) {
      if (existingSubscriber.status === 'subscribed') {
        return NextResponse.json(
          { message: 'This email is already subscribed' },
          { status: 400 }
        )
      } else {
        // Resubscribe
        existingSubscriber.status = 'subscribed'
        existingSubscriber.subscribedAt = new Date()
        existingSubscriber.unsubscribedAt = undefined
        await existingSubscriber.save()

        return NextResponse.json(
          { 
            message: 'Welcome back! You\'ve been resubscribed.',
            success: true 
          },
          { status: 200 }
        )
      }
    }

    // Create new subscriber
    await Newsletter.create({
      email,
      status: 'subscribed',
      source: 'website',
    })

    console.log('✅ Newsletter subscriber saved to database:', email)

    // Send email notification to admin
    const emailResult = await sendNewsletterSubscriptionNotification({ email })

    if (!emailResult.success) {
      console.warn('⚠️ Subscriber saved to DB but email notification failed')
    }

    return NextResponse.json(
      { 
        message: 'Successfully subscribed! Check your email for confirmation.',
        success: true 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)

    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'This email is already subscribed' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
