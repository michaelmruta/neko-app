const nodemailer = require("nodemailer");

// Configure email transporter (replace with your SMTP settings in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "user@example.com",
    pass: process.env.SMTP_PASS || "password",
  },
});

/**
 * Send verification email to user
 * @param {string} email - User's email address
 * @param {string} token - Verification token
 * @returns {Promise<void>}
 */
async function sendVerificationEmail(email, token) {
  const verificationUrl = `${
    process.env.BASE_URL || "http://localhost:3000"
  }/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM || '"Neko App" <noreply@example.com>',
    to: email,
    subject: "Verify your email address",
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  });
}

/**
 * Send password reset email to user
 * @param {string} email - User's email address
 * @param {string} token - Reset token
 * @returns {Promise<void>}
 */
async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${
    process.env.BASE_URL || "http://localhost:3000"
  }/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM || '"Neko App" <noreply@example.com>',
    to: email,
    subject: "Reset your password",
    html: `
      <h1>Password Reset</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
