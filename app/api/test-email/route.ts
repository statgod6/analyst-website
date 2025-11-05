import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail, sendOrderReceiptEmail } from '@/lib/email'

/**
 * Test Email Endpoint
 * Use this to test email sending without making a real payment
 * 
 * Usage:
 * POST /api/test-email
 * Body: { type: 'confirmation' | 'receipt', email: 'test@example.com' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const testData = {
      to: email,
      customerName: 'Test Customer',
      orderNumber: `ORD-TEST-${Date.now()}`,
      productName: '2025 Political Assessment Report (Test)',
      amount: 500,
      currency: 'INR',
      downloadUrl: `${siteUrl}/download/ORD-TEST-123`,
      receiptUrl: `${siteUrl}/receipt/ORD-TEST-123`,
    }

    let result

    if (type === 'receipt') {
      result = await sendOrderReceiptEmail(testData)
    } else {
      result = await sendOrderConfirmationEmail(testData)
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to send email', error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Test ${type} email sent successfully to ${email}`,
      data: result.data,
    })
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send test email', error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint',
    usage: 'POST with body: { type: \"confirmation\" | \"receipt\", email: \"test@example.com\" }',
  })
}
