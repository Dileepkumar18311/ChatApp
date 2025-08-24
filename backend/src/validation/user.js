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
