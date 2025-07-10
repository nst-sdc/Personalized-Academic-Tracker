// Enhanced sendEmail.js with HTML template
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // HTML template for verification email
    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
                .header { background: linear-gradient(135deg, #4361ee, #4cc9f0); color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background-color: #f9f9f9; }
                .button { display: inline-block; padding: 12px 30px; background: linear-gradient(to right, #4361ee, #4cc9f0); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to your Personalized Academic Tracker!</h1>
                </div>
                <div class="content">
                    <h2>Verify Your Email Address</h2>
                    <p>Thank you for registering! Please click the button below to verify your email address:</p>
                    <a href="${options.verificationUrl}" class="button">Verify Email</a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; color: #4361ee;">${options.verificationUrl}</p>
                    <p><strong>This link will expire in 15 minutes.</strong></p>
                </div>
                <div class="footer">
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: `Your App <noreply@yourapp.com>`,
        to: options.email,
        subject: options.subject,
        text: options.message, // Fallback for email clients that don't support HTML
        html: options.html || htmlTemplate
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;