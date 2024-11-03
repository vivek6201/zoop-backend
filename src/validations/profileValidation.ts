import { z } from "zod";

export const adminProfileSchema = z.object({});

export const userProfileSchema = z.object({
  phoneNumber: z.number().min(10).max(10),
  address: z.string().min(3),
  dob: z.date(),
});

export const vendorProfileSchema = z.object({
  bussinessName: z.string().min(3),
  bussinessAddress: z.string().min(3),
  phoneNumber: z.number().min(10),
});

export const deliveryProfileSchema = z.object({});
