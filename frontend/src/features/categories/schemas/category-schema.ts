import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must be 255 characters or fewer" }),
  description: z
    .string()
    .max(255, { message: "Description must be 255 characters or fewer" }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
