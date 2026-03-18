import { z } from "zod";

export const adminRegisterSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password minimum 8 characters"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

export const customerLoginSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  password: z.string().min(1, "Password required"),
});