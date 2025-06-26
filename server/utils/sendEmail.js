const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter (using a service like Mailtrap for development)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2. Define email options
    const mailOptions = {
        from: `Your App <noreply@yourapp.com>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
