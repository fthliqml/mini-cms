import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  image: z
    .custom<File>(
      (value) =>
        typeof File !== "undefined" && value instanceof File,
      { message: "Select a valid image" },
    )
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: "Image must be 5 MB or smaller",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Use a JPEG, PNG, or WebP image",
    })
    .optional(),
  remove_image: z.boolean(),
  status: z.enum(["draft", "published"]),
});

export type PostFormValues = z.infer<typeof postSchema>;
