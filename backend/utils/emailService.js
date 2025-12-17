const SibApiV3Sdk = require('sib-api-v3-sdk');

// ------------------
// Configure Brevo
// ------------------
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// ------------------
// Helpers
// ------------------
const isValidEmail = (email) => {
    return (
        typeof email === 'string' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    );
};

// ------------------
// Send user credentials
// ------------------
const sendUserCredentials = async (userEmail, userName, password) => {
    try {
        console.log('EMAIL DEBUG →', userEmail);

        if (!isValidEmail(userEmail)) {
            console.error('Invalid email passed to Brevo:', userEmail);
            return false;
        }

        const email = new SibApiV3Sdk.SendSmtpEmail();

        email.subject = 'Your Account Credentials - Snabbtech';

        email.htmlContent = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
                <h2>Welcome to Snabbtech</h2>
                <p>Hello ${userName || 'User'},</p>
                <p>Your account has been created successfully.</p>
                <div style="background:#f5f5f5;padding:15px;border-radius:5px;">
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p><strong>Password:</strong> ${password}</p>
                </div>
                <p style="color:red;"><strong>Please change your password after first login.</strong></p>
                <p>Snabbtech Team</p>
            </div>
        `;

        email.sender = {
            name: 'Snabbtech',
            email: process.env.BREVO_SENDER_EMAIL
        };

        email.to = [
            {
                email: userEmail.trim(),
                name: userName || 'User'
            }
        ];

        const res = await apiInstance.sendTransacEmail(email);
        console.log('Brevo success →', res.messageId);
        return true;

    } catch (err) {
        console.error(
            'Brevo error →',
            err.response?.body || err.message
        );
        return false;
    }
};

// ------------------
// Send password reset email
// ------------------
const sendPasswordResetEmail = async (adminEmail, adminName, resetToken) => {
    try {
        console.log('RESET EMAIL DEBUG →', adminEmail);

        if (!isValidEmail(adminEmail)) {
            console.error('Invalid admin email:', adminEmail);
            return false;
        }

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const email = new SibApiV3Sdk.SendSmtpEmail();

        email.subject = 'Password Reset - Snabbtech Admin';

        email.htmlContent = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
                <h2>Password Reset</h2>
                <p>Hello ${adminName || 'Admin'},</p>
                <p>Click below to reset your password:</p>
                <a href="${resetUrl}"
                   style="display:inline-block;background:#007bff;color:#fff;
                          padding:12px 24px;border-radius:5px;text-decoration:none;">
                    Reset Password
                </a>
                <p>This link expires in 1 hour.</p>
                <p>If you didn’t request this, ignore this email.</p>
            </div>
        `;

        email.sender = {
            name: 'Snabbtech',
            email: process.env.BREVO_SENDER_EMAIL
        };

        email.to = [
            {
                email: adminEmail.trim(),
                name: adminName || 'Admin'
            }
        ];

        const res = await apiInstance.sendTransacEmail(email);
        console.log('Reset email sent →', res.messageId);
        return true;

    } catch (err) {
        console.error(
            'Brevo reset error →',
            err.response?.body || err.message
        );
        return false;
    }
};

module.exports = {
    sendUserCredentials,
    sendPasswordResetEmail
};
