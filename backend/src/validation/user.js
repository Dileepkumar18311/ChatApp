import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().min(5).max(100), // Accept email or phone
  displayName: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(100),
}).refine(data => data.username || data.email, {
  message: "Either username or email is required"
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long").max(100),
});
