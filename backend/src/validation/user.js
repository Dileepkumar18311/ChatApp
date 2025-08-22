import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().min(5).max(100), // Accept email or phone
  displayName: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});
