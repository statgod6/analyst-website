import { NextRequest, NextResponse } from 'next/server'
import { normalizeEmail, prisma } from '@/lib/db'
import { sendNewsletterSubscriptionNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ message: 'Email address is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Please provide a valid email address' }, { status: 400 })
    }

    const normalizedEmail = normalizeEmail(email)
    const existingSubscriber = await prisma.newsletter.findUnique({ where: { email: normalizedEmail } })

    if (existingSubscriber) {
      if (existingSubscriber.status === 'subscribed') {
        return NextResponse.json({ message: 'This email is already subscribed' }, { status: 400 })
      }

      await prisma.newsletter.update({
        where: { email: normalizedEmail },
        data: { status: 'subscribed', subscribedAt: new Date(), unsubscribedAt: null },
      })

      return NextResponse.json(
        { message: 'Welcome back! You\'ve been resubscribed.', success: true },
        { status: 200 }
      )
    }

    await prisma.newsletter.create({
      data: { email: normalizedEmail, status: 'subscribed', source: 'website' },
    })

    console.log('✅ Newsletter subscriber saved to database:', normalizedEmail)

    const emailResult = await sendNewsletterSubscriptionNotification({ email })
    if (!emailResult.success) {
      console.warn('⚠️ Subscriber saved to DB but email notification failed')
    }

    return NextResponse.json(
      { message: 'Successfully subscribed! Check your email for confirmation.', success: true },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)

    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'This email is already subscribed' }, { status: 400 })
    }

    return NextResponse.json({ message: 'An error occurred. Please try again.' }, { status: 500 })
  }
}
