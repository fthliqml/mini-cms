import { z } from "zod";

export const postSchema = z.object({
  user_id: z.number().int().positive().optional(),
  category_id: z
    .number()
    .int()
    .positive({ message: "Select a category" }),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be 255 characters or fewer" }),
  excerpt: z
    .string()
    .max(500, { message: "Excerpt must be 500 characters or fewer" }),
  content: z.string().min(1, { message: "Content is required" }),
  status: z.enum(["draft", "published"]),
});

export type PostFormValues = z.infer<typeof postSchema>;
