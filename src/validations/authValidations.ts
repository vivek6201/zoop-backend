import { Role } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6).optional()
});

export const signupSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    role: z.nativeEnum(Role),
    otp: z.string().min(6).max(6).optional()
})
