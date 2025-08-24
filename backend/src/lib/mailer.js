import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

export async function sendConfirmationEmail(to, displayName, userId) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
  const verifyLink = `${BASE_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: `Pulse <${EMAIL_USER}>`,
    to,
    subject: 'Welcome to Pulse! Confirm your email',
    html: `<h2>Welcome, ${displayName}!</h2><p>Thanks for signing up. Please <a href="${verifyLink}">click here to verify your email</a> and activate your account.</p>`
  });
}

export async function sendPasswordResetEmail(to, displayName, resetToken) {
  console.log('Email config:', { EMAIL_USER, hasEmailPass: !!EMAIL_PASS });
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:8080/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `Pulse <${EMAIL_USER}>`,
    to,
    subject: 'Reset Your Pulse Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hi ${displayName},</p>
      <p>You requested to reset your password for your Pulse account.</p>
      <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>Best regards,<br>The Pulse Team</p>
    `
  });
}
