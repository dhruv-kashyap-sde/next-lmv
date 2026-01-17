import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Initialize providers based on environment
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend';

// Resend client (for production)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Gmail/Brevo transporter (for dev/alternative)
const getNodemailerTransporter = () => {
  if (EMAIL_PROVIDER === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  
  if (EMAIL_PROVIDER === 'brevo') {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.BREVO_API_KEY,
      },
    });
  }
  
  return null;
};

/**
 * Send OTP email for signup verification
 */
export async function sendOtpEmail(email, otp, name = 'User') {
  const fromEmail = process.env.EMAIL_FROM || 'noreply@yourdomain.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'LMV';
  
  const subject = `${otp} is your verification code`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 500px; margin: 0 auto; background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 16px; border: 1px solid #333;">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #f5c518; letter-spacing: 2px;">LMV</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <h2 style="margin: 0 0 10px; font-size: 24px; font-weight: 600; color: #ffffff; text-align: center;">
                      Verify Your Email
                    </h2>
                    <p style="margin: 0 0 30px; font-size: 15px; color: #a0a0a0; text-align: center; line-height: 1.6;">
                      Hi ${name}, use the code below to complete your signup.
                    </p>
                  </td>
                </tr>
                
                <!-- OTP Box -->
                <tr>
                  <td style="padding: 0 40px;">
                    <div style="background: linear-gradient(145deg, #252525 0%, #1a1a1a 100%); border: 2px solid #f5c518; border-radius: 12px; padding: 25px; text-align: center;">
                      <p style="margin: 0 0 10px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 2px;">
                        Your verification code
                      </p>
                      <p style="margin: 0; font-size: 42px; font-weight: 700; color: #f5c518; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${otp}
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Warning -->
                <tr>
                  <td style="padding: 30px 40px;">
                    <p style="margin: 0; font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
                      This code expires in <strong style="color: #f5c518;">10 minutes</strong>.<br>
                      Do not share this code with anyone.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; border-top: 1px solid #222;">
                    <p style="margin: 0; font-size: 12px; color: #555; text-align: center; line-height: 1.6;">
                      If you didn't request this code, please ignore this email.<br>
                      &copy; ${new Date().getFullYear()} LMV. All rights reserved.
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
Your LMV verification code is: ${otp}

Hi ${name},

Use this code to complete your signup. The code expires in 10 minutes.

Do not share this code with anyone.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} LMV
  `.trim();

  try {
    // Use Resend if available (preferred for production)
    if (EMAIL_PROVIDER === 'resend' && resend) {
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error('Failed to send email');
      }

      console.log('OTP email sent via Resend:', data?.id);
      return { success: true, messageId: data?.id };
    }

    // Fallback to nodemailer (Gmail/Brevo)
    const transporter = getNodemailerTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: email,
        subject,
        html: htmlContent,
        text: textContent,
      });

      console.log(`OTP email sent via ${EMAIL_PROVIDER}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    }

    throw new Error('No email provider configured');
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't expose provider errors to client
    return { success: false, error: 'Failed to send verification email' };
  }
}
