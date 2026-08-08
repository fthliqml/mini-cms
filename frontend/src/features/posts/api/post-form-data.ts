import type { CreatePostInput, UpdatePostInput } from "../types/post";

type PostMutationInput = CreatePostInput | UpdatePostInput;

export function createPostFormData(input: PostMutationInput) {
  const formData = new FormData();

  formData.set("category_id", String(input.category_id));
  formData.set("title", input.title);
  formData.set("excerpt", input.excerpt ?? "");
  formData.set("content", input.content);
  formData.set("status", input.status);

  if (input.user_id) {
    formData.set("user_id", String(input.user_id));
  }

  if (input.image) {
    formData.set("image", input.image);
  }

  if (input.remove_image) {
    formData.set("remove_image", "1");
  }

  return formData;
}
