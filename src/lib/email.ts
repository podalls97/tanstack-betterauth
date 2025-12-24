import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set')
}

if (!process.env.ADMIN_EMAIL) {
  throw new Error('ADMIN_EMAIL environment variable is not set')
}

if (!process.env.EMAIL_FROM) {
  throw new Error('EMAIL_FROM environment variable is not set')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendPasswordResetEmailParams {
  to: string
  username: string
  resetUrl: string
}

export async function sendPasswordResetEmail({
  to,
  username,
  resetUrl,
}: SendPasswordResetEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [to],
      subject: 'Access Approved - Set Your Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Access Approved</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">

              <div style="background: #10b981; padding: 32px 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Access Approved</h1>
              </div>

              <div style="padding: 32px 24px;">
                <p style="font-size: 16px; margin: 0 0 16px 0; color: #1f2937;">
                  Hello <strong>${username}</strong>,
                </p>

                <p style="font-size: 16px; margin: 0 0 24px 0; color: #4b5563; line-height: 1.6;">
                  Great news! Your access request has been approved. Click the button below to set your password and access the system.
                </p>

                <div style="text-align: center; margin: 32px 0;">
                  <a href="${resetUrl}"
                     style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                    Set Your Password
                  </a>
                </div>

                <div style="background: #fef3c7; padding: 16px; border-radius: 6px; border-left: 3px solid #f59e0b; margin: 24px 0;">
                  <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.5;">
                    <strong>Important:</strong> This link expires in 1 hour for security.
                  </p>
                </div>

                <p style="font-size: 14px; margin: 24px 0 8px 0; color: #6b7280;">
                  If the button doesn't work, copy this link:
                </p>
                <p style="font-size: 13px; color: #10b981; word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 4px; margin: 0;">
                  ${resetUrl}
                </p>
              </div>

              <div style="background: #f9fafb; padding: 16px 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0; text-align: center;">
                  PTIS Installer Admin System
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log('Password reset email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    throw error
  }
}

export interface SendAccessRequestNotificationParams {
  requestorName: string
  requestorEmail: string
  requestorUsername: string
  reason: string
}

export async function sendAccessRequestNotification({
  requestorName,
  requestorEmail,
  requestorUsername,
  reason,
}: SendAccessRequestNotificationParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [process.env.ADMIN_EMAIL!],
      subject: 'New Access Request Received',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Access Request</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f59e0b; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">New Access Request 📝</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                A new user has requested access to the system.
              </p>

              <div style="background: white; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="margin: 8px 0;"><strong>Name:</strong> ${requestorName}</p>
                <p style="margin: 8px 0;"><strong>Username:</strong> ${requestorUsername}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> ${requestorEmail}</p>
                <p style="margin: 8px 0;"><strong>Reason:</strong></p>
                <p style="margin: 8px 0; padding: 12px; background: #f3f4f6; border-radius: 4px; font-style: italic;">
                  ${reason}
                </p>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                Please log in to the admin panel to review and approve/reject this request.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      // Don't throw error here - we don't want to fail the request submission if notification fails
      return { success: false, error }
    }

    console.log('Access request notification sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send access request notification:', error)
    // Don't throw - notification is not critical
    return { success: false, error }
  }
}

export interface SendRejectionEmailParams {
  to: string
  name: string
  username: string
  reviewerNotes?: string
}

export async function sendRejectionEmail({
  to,
  name,
  username,
  reviewerNotes,
}: SendRejectionEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [to],
      subject: 'Access Request Update',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Access Request Update</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">

              <div style="background: #6b7280; padding: 32px 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Access Request Update</h1>
              </div>

              <div style="padding: 32px 24px;">
                <p style="font-size: 16px; margin: 0 0 16px 0; color: #1f2937;">
                  Hello <strong>${name}</strong>,
                </p>

                <p style="font-size: 16px; margin: 0 0 24px 0; color: #4b5563; line-height: 1.6;">
                  Thank you for your interest in accessing our system. After careful review, we are unable to approve your access request at this time.
                </p>

                <div style="background: #f3f4f6; padding: 16px; border-radius: 6px; border-left: 3px solid #6b7280; margin: 24px 0;">
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    <strong>Username:</strong> ${username}
                  </p>
                </div>

                ${
                  reviewerNotes
                    ? `
                <div style="margin: 24px 0;">
                  <p style="font-size: 14px; font-weight: 600; color: #374151; margin: 0 0 8px 0;">
                    Note from our team:
                  </p>
                  <p style="font-size: 14px; color: #4b5563; margin: 0; padding: 12px; background: #fef3c7; border-radius: 6px; line-height: 1.5;">
                    ${reviewerNotes}
                  </p>
                </div>
                `
                    : ''
                }

                <p style="font-size: 14px; margin: 24px 0 0 0; color: #6b7280; line-height: 1.5;">
                  If you believe this decision was made in error or have additional information to share, please contact our support team.
                </p>
              </div>

              <div style="background: #f9fafb; padding: 16px 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0; text-align: center;">
                  PTIS Installer Admin System
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(`Failed to send rejection email: ${error.message}`)
    }

    console.log('Rejection email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send rejection email:', error)
    // Don't throw - email is not critical to the rejection process
    return { success: false, error }
  }
}
