import { NextRequest, NextResponse } from 'next/server'
import { prisma, normalizeEmail } from '@/lib/db'
import { sendContactFormNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, organization, inquiryType, budget, message } = body

    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json({ message: 'Please fill in all required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Please provide a valid email address' }, { status: 400 })
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email: normalizeEmail(email),
        organization: organization || null,
        inquiryType,
        budget: budget || null,
        message,
        status: 'new',
      },
    })

    console.log('✅ Contact form saved to database:', contact.id)

    const emailResult = await sendContactFormNotification({
      name,
      email,
      organization,
      inquiryType,
      budget,
      message,
    })

    if (!emailResult.success) {
      console.warn('⚠️ Contact saved to DB but email notification failed')
    }

    return NextResponse.json(
      { message: 'Thank you for your message! I will get back to you within 24-48 hours.', success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { message: 'An error occurred. Please try again or email directly.' },
      { status: 500 }
    )
  }
}
