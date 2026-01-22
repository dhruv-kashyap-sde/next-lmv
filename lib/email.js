import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, name, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  const fromEmail = process.env.EMAIL_FROM || 'noreply@mails.lootmyvouchers.in';
  const fromName = process.env.EMAIL_FROM_NAME || 'LMV';

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
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 16px; border: 1px solid #333;">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #f5c518; letter-spacing: 2px;">LMV</h1>
                    <p style="margin: 10px 0 0; font-size: 18px; color: #fff; font-weight: 600;">Welcome!</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <h2 style="margin: 0 0 15px; font-size: 24px; font-weight: 600; color: #ffffff;">Hi ${name},</h2>
                    <p style="margin: 0 0 20px; font-size: 15px; color: #a0a0a0; line-height: 1.6;">
                      Thank you for signing up! Please verify your email address to get started.
                    </p>
                  </td>
                </tr>
                
                <!-- Button -->
                <tr>
                  <td style="padding: 0 40px 30px; text-align: center;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 14px 40px; background: #f5c518; color: #000; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
                
                <!-- Link -->
                <tr>
                  <td style="padding: 0 40px 30px;">
                    <p style="margin: 0 0 10px; font-size: 13px; color: #888; text-align: center;">
                      Or copy and paste this link in your browser:
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #f5c518; word-break: break-all; text-align: center;">
                      ${verificationUrl}
                    </p>
                  </td>
                </tr>
                
                <!-- Warning -->
                <tr>
                  <td style="padding: 0 40px 30px;">
                    <p style="margin: 0; font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
                      This link will expire in <strong style="color: #f5c518;">24 hours</strong>.<br>
                      If you didn't create an account, please ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; border-top: 1px solid #222;">
                    <p style="margin: 0; font-size: 12px; color: #555; text-align: center; line-height: 1.6;">
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
Welcome to LMV!

Hi ${name},

Thank you for signing up! Please verify your email address to get started.

Click the link below to verify your email:
${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

© ${new Date().getFullYear()} LMV
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Verification email sent via Resend:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
}

export async function sendPasswordResetEmail(email, name, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  const fromEmail = process.env.EMAIL_FROM || 'noreply@mails.lootmyvouchers.in';
  const fromName = process.env.EMAIL_FROM_NAME || 'LMV';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
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
                    <p style="margin: 10px 0 0; font-size: 18px; color: #fff; font-weight: 600;">Password Reset</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <h2 style="margin: 0 0 15px; font-size: 24px; font-weight: 600; color: #ffffff;">Hi ${name},</h2>
                    <p style="margin: 0 0 20px; font-size: 15px; color: #a0a0a0; line-height: 1.6;">
                      We received a request to reset your password.
                    </p>
                  </td>
                </tr>
                
                <!-- Button -->
                <tr>
                  <td style="padding: 0 40px 30px; text-align: center;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 40px; background: #f5c518; color: #000; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
                
                <!-- Link -->
                <tr>
                  <td style="padding: 0 40px 30px;">
                    <p style="margin: 0 0 10px; font-size: 13px; color: #888; text-align: center;">
                      Or copy and paste this link in your browser:
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #f5c518; word-break: break-all; text-align: center;">
                      ${resetUrl}
                    </p>
                  </td>
                </tr>
                
                <!-- Warning -->
                <tr>
                  <td style="padding: 0 40px 30px;">
                    <p style="margin: 0; font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
                      This link will expire in <strong style="color: #f5c518;">1 hour</strong>.<br>
                      If you didn't request a password reset, please ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; border-top: 1px solid #222;">
                    <p style="margin: 0; font-size: 12px; color: #555; text-align: center; line-height: 1.6;">
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
Password Reset Request

Hi ${name},

We received a request to reset your password.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

© ${new Date().getFullYear()} LMV
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: email,
      subject: 'Reset Your Password',
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Password reset email sent via Resend:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
}
