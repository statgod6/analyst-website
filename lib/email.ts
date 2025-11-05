import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderConfirmationEmailData {
  to: string
  customerName: string
  orderNumber: string
  productName: string
  amount: number
  currency: string
  downloadUrl: string
  receiptUrl: string
}

/**
 * Send Order Confirmation Email
 * Sent immediately after successful payment
 */
export async function sendOrderConfirmationEmail(data: OrderConfirmationEmailData) {
  try {
    const { to, customerName, orderNumber, productName, amount, currency, downloadUrl, receiptUrl } = data

    const currencySymbol = currency === 'USD' ? '$' : '₹'

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Shikhaa <onboarding@resend.dev>',
      to: [to],
      subject: `✅ Payment Successful - Order ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Shikhaa</h1>
                        <p style="margin: 8px 0 0 0; color: #93c5fd; font-size: 14px;">Political Analyst & Strategist</p>
                      </td>
                    </tr>
                    
                    <!-- Success Badge -->
                    <tr>
                      <td style="padding: 30px 30px 20px; text-align: center;">
                        <div style="display: inline-block; background-color: #d1fae5; border-radius: 50%; padding: 16px; margin-bottom: 20px;">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <h2 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">Payment Successful! 🎉</h2>
                        <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 16px;">Thank you for your purchase, ${customerName}!</p>
                      </td>
                    </tr>
                    
                    <!-- Order Details -->
                    <tr>
                      <td style="padding: 0 30px 30px;">
                        <table style="width: 100%; background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
                          <tr>
                            <td>
                              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase;">Order Details</p>
                              <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order Number:</td>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; font-family: monospace;">${orderNumber}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Product:</td>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${productName}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount Paid:</td>
                                  <td style="padding: 8px 0; color: #059669; font-size: 18px; font-weight: bold; text-align: right;">${currencySymbol}${amount.toFixed(2)}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Download Button -->
                    <tr>
                      <td style="padding: 0 30px 30px; text-align: center;">
                        <a href="${downloadUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; margin-bottom: 12px;">
                          📥 Download Your Product Now
                        </a>
                        <br>
                        <a href="${receiptUrl}" style="display: inline-block; color: #3b82f6; text-decoration: none; font-size: 14px; margin-top: 12px;">
                          📄 View Receipt
                        </a>
                      </td>
                    </tr>
                    
                    <!-- Important Info -->
                    <tr>
                      <td style="padding: 0 30px 30px;">
                        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px;">
                          <p style="margin: 0 0 12px 0; color: #1e40af; font-size: 14px; font-weight: 600;">📌 Important Information:</p>
                          <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                            <li>Your download link never expires</li>
                            <li>You can re-download anytime from the link above</li>
                            <li>Bookmark your download page for easy access</li>
                            <li>Check your spam folder if you don't see this email</li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Support -->
                    <tr>
                      <td style="padding: 0 30px 30px; text-align: center;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Need help?</p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                          Contact us at <a href="mailto:support@example.com" style="color: #3b82f6; text-decoration: none;">support@example.com</a>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">This email was sent to ${to}</p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2025 Shikhaa. All rights reserved.</p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Failed to send order confirmation email:', error)
      return { success: false, error }
    }

    console.log('✅ Order confirmation email sent:', emailData?.id)
    return { success: true, data: emailData }
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error)
    return { success: false, error }
  }
}

/**
 * Send Order Receipt Email
 * Can be sent on demand or as a follow-up
 */
export async function sendOrderReceiptEmail(data: OrderConfirmationEmailData) {
  try {
    const { to, customerName, orderNumber, productName, amount, currency, receiptUrl, downloadUrl } = data

    const currencySymbol = currency === 'USD' ? '$' : '₹'

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Shikhaa <onboarding@resend.dev>',
      to: [to],
      subject: `📄 Your Receipt - Order ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Receipt</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%); padding: 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Payment Receipt</h1>
                        <p style="margin: 8px 0 0 0; color: #93c5fd; font-size: 14px;">Order ${orderNumber}</p>
                      </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                      <td style="padding: 30px 30px 20px;">
                        <p style="margin: 0; color: #1f2937; font-size: 16px;">Dear ${customerName},</p>
                        <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          Thank you for your purchase! This email serves as your official receipt for the order below.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Receipt Details -->
                    <tr>
                      <td style="padding: 0 30px 30px;">
                        <table style="width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                          <tr style="background-color: #f9fafb;">
                            <td colspan="2" style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
                              <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 600;">RECEIPT DETAILS</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Order Number</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; font-family: monospace;">${orderNumber}</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Product</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${productName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Customer</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${customerName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Email</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${to}</td>
                          </tr>
                          <tr style="background-color: #f0fdf4;">
                            <td style="padding: 16px; color: #166534; font-size: 16px; font-weight: 600;">Total Paid</td>
                            <td style="padding: 16px; color: #166534; font-size: 20px; font-weight: bold; text-align: right;">${currencySymbol}${amount.toFixed(2)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Action Buttons -->
                    <tr>
                      <td style="padding: 0 30px 30px; text-align: center;">
                        <a href="${receiptUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; margin: 0 8px 12px 8px;">
                          View Full Receipt
                        </a>
                        <br>
                        <a href="${downloadUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; margin: 0 8px;">
                          Download Product
                        </a>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Questions? Contact us at support@example.com</p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2025 Shikhaa. All rights reserved.</p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Failed to send receipt email:', error)
      return { success: false, error }
    }

    console.log('✅ Receipt email sent:', emailData?.id)
    return { success: true, data: emailData }
  } catch (error) {
    console.error('❌ Error sending receipt email:', error)
    return { success: false, error }
  }
}

interface ContactFormEmailData {
  name: string
  email: string
  organization?: string
  inquiryType: string
  budget?: string
  message: string
}

/**
 * Send Contact Form Notification to Admin
 * Sent when a user submits the contact form
 */
export async function sendContactFormNotification(data: ContactFormEmailData) {
  try {
    const { name, email, organization, inquiryType, budget, message } = data

    const inquiryTypeLabels: { [key: string]: string } = {
      'ai-consulting': 'AI Consulting & Setup',
      'custom-prompts': 'Custom AI Prompts',
      'collaboration': 'Collaboration Request',
      'bulk-purchase': 'Bulk Resource Purchase',
      'general': 'General Inquiry',
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Contact Form <onboarding@resend.dev>',
      to: [adminEmail],
      reply_to: email,
      subject: `🔔 New Contact Form: ${inquiryTypeLabels[inquiryType]} from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%); padding: 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔔 New Contact Form</h1>
                        <p style="margin: 8px 0 0 0; color: #93c5fd; font-size: 14px;">${inquiryTypeLabels[inquiryType]}</p>
                      </td>
                    </tr>
                    
                    <!-- Contact Details -->
                    <tr>
                      <td style="padding: 30px;">
                        <table style="width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                          <tr style="background-color: #f9fafb;">
                            <td colspan="2" style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
                              <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 600;">CONTACT INFORMATION</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; width: 30%;">Name</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 14px; font-weight: 600;">${name}</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Email</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 14px; font-weight: 600;">
                              <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                            </td>
                          </tr>
                          ${organization ? `
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Organization</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 14px; font-weight: 600;">${organization}</td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Inquiry Type</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 14px; font-weight: 600;">${inquiryTypeLabels[inquiryType]}</td>
                          </tr>
                          ${budget ? `
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Budget</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 14px; font-weight: 600;">${budget}</td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Message -->
                    <tr>
                      <td style="padding: 0 30px 30px;">
                        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                          <p style="margin: 0 0 12px 0; color: #374151; font-size: 14px; font-weight: 600;">MESSAGE:</p>
                          <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Reply Button -->
                    <tr>
                      <td style="padding: 0 30px 30px; text-align: center;">
                        <a href="mailto:${email}?subject=Re: ${inquiryTypeLabels[inquiryType]}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600;">
                          📧 Reply to ${name}
                        </a>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">This is an automated notification from your contact form</p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Failed to send contact form notification:', error)
      return { success: false, error }
    }

    console.log('✅ Contact form notification sent:', emailData?.id)
    return { success: true, data: emailData }
  } catch (error) {
    console.error('❌ Error sending contact form notification:', error)
    return { success: false, error }
  }
}

interface NewsletterSubscriptionData {
  email: string
}

/**
 * Send Newsletter Subscription Notification to Admin
 * Sent when a user subscribes to the newsletter
 */
export async function sendNewsletterSubscriptionNotification(data: NewsletterSubscriptionData) {
  try {
    const { email } = data
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Newsletter <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `🎉 New Newsletter Subscriber: ${email}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Newsletter Subscriber</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎉 New Subscriber!</h1>
                        <p style="margin: 8px 0 0 0; color: #d1fae5; font-size: 14px;">Newsletter Subscription</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                          <div style="display: inline-block; background-color: #d1fae5; border-radius: 50%; padding: 20px; margin-bottom: 20px;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                          </div>
                          <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 24px; font-weight: bold;">Someone just subscribed!</h2>
                          <p style="margin: 0; color: #6b7280; font-size: 16px;">You have a new newsletter subscriber</p>
                        </div>
                        
                        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
                          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; font-weight: 600;">Subscriber Email</p>
                          <p style="margin: 0; color: #1f2937; font-size: 18px; font-weight: bold; font-family: monospace;">
                            <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Stats -->
                    <tr>
                      <td style="padding: 0 30px 30px;">
                        <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; text-align: center;">
                          <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px;">💡 <strong>Tip:</strong> Don't forget to send them a welcome email!</p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">Newsletter subscription from your website</p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Failed to send newsletter notification:', error)
      return { success: false, error }
    }

    console.log('✅ Newsletter subscription notification sent:', emailData?.id)
    return { success: true, data: emailData }
  } catch (error) {
    console.error('❌ Error sending newsletter notification:', error)
    return { success: false, error }
  }
}

export default resend
