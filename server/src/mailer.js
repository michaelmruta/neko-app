const nodemailer = require("nodemailer");

// Create reusable transporter
let transporter;

// Initialize transporter
async function initializeTransporter() {
  // For development environment
  if (process.env.NODE_ENV !== "production") {
    // Create test account
    const testAccount = await nodemailer.createTestAccount();

    // Configure with Ethereal credentials
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("Ethereal Email credentials:", {
      user: testAccount.user,
      pass: testAccount.pass,
      preview: testAccount.web, // URL to view emails
    });
  } else {
    // Production configuration
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "user@example.com",
        pass: process.env.SMTP_PASS || "password",
      },
    });
  }
}

// Initialize transporter when module is loaded
initializeTransporter();

/**
 * Send verification email to user
 * @param {string} email - User's email address
 * @param {string} token - Verification token
 * @returns {Promise<void>}
 */
async function sendVerificationEmail(email, token) {
  const verificationUrl = `${
    process.env.BASE_URL || "http://localhost:3000"
  }/api/verify-email/${token}`;

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || '"Neko App" <noreply@example.com>',
    to: email,
    subject: "Verify your email address",
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  });

  // Log preview URL in development environment
  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
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
