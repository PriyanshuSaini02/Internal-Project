const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send user credentials email
const sendUserCredentials = async (userEmail, userName, password) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Snabbtech" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Your Account Credentials - Snabbtech',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to Snabbtech!</h2>
                <p>Hello ${userName},</p>
                <p>Your account has been created successfully. Here are your login credentials:</p>
                <div style="background-color:#f5f5f5;padding:15px;border-radius:5px;">
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p><strong>Password:</strong> ${password}</p>
                </div>
                <p style="color:red;"><strong>Please change your password after first login.</strong></p>
                <p>Best regards,<br>Snabbtech Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('User credentials email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending user credentials email:', error);
        return false;
    }
};

// Send password reset email
const sendPasswordResetEmail = async (adminEmail, adminName, resetToken) => {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const mailOptions = {
        from: `"Snabbtech" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: 'Password Reset Request - Snabbtech Admin',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Hello ${adminName},</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align:center;margin:30px 0;">
                    <a href="${resetUrl}"
                       style="background:#007bff;color:#fff;padding:12px 30px;text-decoration:none;border-radius:5px;">
                        Reset Password
                    </a>
                </div>
                <p>This link expires in 1 hour.</p>
                <p>If you didn’t request this, ignore this email.</p>
                <p>Best regards,<br>Snabbtech Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};

module.exports = {
    sendUserCredentials,
    sendPasswordResetEmail
};
