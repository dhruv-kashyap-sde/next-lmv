import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import { withAuth } from '@/lib/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST - Send reply to message (Admin only)
async function sendReply(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content } = body;
    
    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Reply must be at least 10 characters' },
        { status: 400 }
      );
    }
    
    if (content.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Reply cannot exceed 5000 characters' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find the message
    const message = await Message.findById(id);
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    
    const fromEmail = process.env.EMAIL_FROM || 'noreply@mails.lootmyvouchers.in';
    const fromName = process.env.EMAIL_FROM_NAME || 'LMV Support';
    
    // Email template for reply
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reply from Loot My Vouchers</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 16px; border: 1px solid #333;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #f5c518; letter-spacing: 2px;">LMV</h1>
                      <p style="margin: 10px 0 0; font-size: 14px; color: #888;">Loot My Vouchers Support</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <h2 style="margin: 0 0 15px; font-size: 22px; font-weight: 600; color: #ffffff;">Hi ${message.name},</h2>
                      <p style="margin: 0 0 20px; font-size: 14px; color: #888;">
                        Thank you for contacting us. Here's our response to your message:
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Original Message Reference -->
                  <tr>
                    <td style="padding: 0 40px 20px;">
                      <div style="background: #0d0d0d; border-left: 3px solid #f5c518; padding: 15px; border-radius: 8px;">
                        <p style="margin: 0 0 5px; font-size: 12px; color: #666; text-transform: uppercase;">Your Original Message:</p>
                        <p style="margin: 0; font-size: 14px; color: #999; font-style: italic;">
                          "${message.message.substring(0, 200)}${message.message.length > 200 ? '...' : ''}"
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Reply Content -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333;">
                        <p style="margin: 0 0 5px; font-size: 12px; color: #f5c518; text-transform: uppercase; font-weight: 600;">Our Response:</p>
                        <p style="margin: 0; font-size: 15px; color: #e0e0e0; line-height: 1.7; white-space: pre-wrap;">
${content}
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Need More Help -->
                  <tr>
                    <td style="padding: 0 40px 30px; text-align: center;">
                      <p style="margin: 0; font-size: 14px; color: #666;">
                        Need more help? Simply reply to this email or visit our 
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" style="color: #f5c518; text-decoration: none;">contact page</a>.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px 40px; border-top: 1px solid #222;">
                      <p style="margin: 0; font-size: 12px; color: #555; text-align: center; line-height: 1.6;">
                        &copy; ${new Date().getFullYear()} Loot My Vouchers. All rights reserved.<br>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #888; text-decoration: none;">lootmyvouchers.in</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
    
    const textContent = `
Hi ${message.name},

Thank you for contacting us. Here's our response to your message:

---
Your Original Message:
"${message.message.substring(0, 200)}${message.message.length > 200 ? '...' : ''}"
---

Our Response:
${content}

---

Need more help? Visit our contact page at ${process.env.NEXT_PUBLIC_APP_URL}/contact

© ${new Date().getFullYear()} Loot My Vouchers
    `.trim();
    
    // Get subject based on message type
    const subjectPrefix = {
      feedback: 'Re: Your Feedback',
      question: 'Re: Your Question',
      help: 'Re: Help Request',
      bug: 'Re: Bug Report',
      other: 'Re: Your Message',
    };
    
    // Send email
    const emailResult = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: message.email,
      subject: `${subjectPrefix[message.type] || 'Re: Your Message'} - Loot My Vouchers`,
      html: htmlContent,
      text: textContent,
    });
    
    if (emailResult.error) {
      console.error('Email send error:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send reply email' },
        { status: 500 }
      );
    }
    
    // Save reply to message
    message.replies.push({
      content: content.trim(),
      sentAt: new Date(),
      sentBy: request.user.userId,
    });
    message.status = 'replied';
    await message.save();
    
    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        emailId: emailResult.data?.id,
        reply: message.replies[message.replies.length - 1],
      }
    });
    
  } catch (error) {
    console.error('Send reply error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}

// GET - Get single message with replies (Admin only)
async function getMessage(request, { params }) {
  try {
    const { id } = await params;
    
    await connectDB();
    
    const message = await Message.findById(id);
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    
    // Mark as read if new
    if (message.status === 'new') {
      message.status = 'read';
      await message.save();
    }
    
    return NextResponse.json({
      success: true,
      data: message,
    });
    
  } catch (error) {
    console.error('Get message error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getMessage, { requiredRole: 'admin' });
export const POST = withAuth(sendReply, { requiredRole: 'admin' });
