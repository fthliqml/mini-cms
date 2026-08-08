import { z } from "zod";

const userFields = {
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must be 255 characters or fewer" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),
  role: z.enum(["admin", "author"]),
};

export const createUserSchema = z.object({
  ...userFields,
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const updateUserSchema = z.object({
  ...userFields,
  password: z
    .string()
    .refine((password) => password.length === 0 || password.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
});

export type UserFormValues = z.infer<typeof createUserSchema>;
