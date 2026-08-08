"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { UserRole } from "@/features/auth/types/auth";
import { useCategoryOptionsQuery } from "@/features/categories/hooks/use-category-options-query";
import { useUserOptionsQuery } from "@/features/users/hooks/use-user-options-query";
import { ApiError, getApiErrorMessage } from "@/lib/api";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../hooks/use-post-mutations";
import { postSchema, type PostFormValues } from "../schemas/post-schema";
import type { CreatePostInput, Post, UpdatePostInput } from "../types/post";
import { MarkdownEditor } from "./markdown-editor";
import { PostImageField } from "./post-image-field";

type PostFormMode = "create" | "edit";

interface PostFormSheetProps {
  mode: PostFormMode;
  post?: Post;
  role: UserRole;
  currentUserId: number;
  onClose: () => void;
  onSaved: () => void;
}

const fieldNames = [
  "user_id",
  "category_id",
  "title",
  "excerpt",
  "content",
  "image",
  "status",
] as const;

export function PostFormSheet({
  mode,
  post,
  role,
  currentUserId,
  onClose,
  onSaved,
}: PostFormSheetProps) {
  const categoriesQuery = useCategoryOptionsQuery();
  const assigneesQuery = useUserOptionsQuery({
    userId: currentUserId,
    role,
  });
  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      user_id:
        role === "admin" ? (post?.author?.id ?? currentUserId) : undefined,
      category_id: post?.category?.id ?? 0,
      title: post?.title ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      image: undefined,
      remove_image: false,
      status: post?.status ?? "draft",
    },
  });
  const isPending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;
  const hasOptionsError =
    categoriesQuery.isError || (role === "admin" && assigneesQuery.isError);

  const onSubmit = async (values: PostFormValues) => {
    const input = {
      category_id: values.category_id,
      title: values.title,
      excerpt: values.excerpt || null,
      content: values.content,
      image: values.image,
      remove_image: values.remove_image,
      status: values.status,
      ...(role === "admin" && values.user_id
        ? { user_id: values.user_id }
        : {}),
    } satisfies CreatePostInput | UpdatePostInput;

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(input);
      } else {
        await updateMutation.mutateAsync({
          slug: post!.slug,
          input,
        });
      }

      onSaved();
    } catch (error: unknown) {
      if (error instanceof ApiError && error.errors) {
        for (const fieldName of fieldNames) {
          const message = error.errors[fieldName]?.[0];
          if (message) {
            setError(fieldName, { type: "server", message });
          }
        }
      }

      setError("root", {
        type: "server",
        message: getApiErrorMessage(error, "The post could not be saved."),
      });
    }
  };

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open && !isPending) {
          onClose();
        }
      }}
    >
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-4xl">
        <SheetHeader className="border-b border-slate-100 px-5 py-4">
          <SheetTitle>
            {mode === "create" ? "Create post" : "Edit post"}
          </SheetTitle>
          <SheetDescription>
            {role === "admin"
              ? "Write the article, choose its owner, and set its publishing state."
              : "Write and publish an article in your own workspace."}
          </SheetDescription>
        </SheetHeader>

        <form
          id="post-editor-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
        >
          {errors.root ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {errors.root.message}
            </div>
          ) : null}

          {hasOptionsError ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Categories or assignees could not be loaded. Close the editor and
              try again.
            </div>
          ) : null}

          <Controller
            name="image"
            control={control}
            render={({ field: imageField }) => (
              <Controller
                name="remove_image"
                control={control}
                render={({ field: removeImageField }) => (
                  <PostImageField
                    file={imageField.value}
                    existingUrl={post?.image_url}
                    removeImage={removeImageField.value}
                    disabled={isPending}
                    error={errors.image?.message}
                    onFileChange={imageField.onChange}
                    onRemoveImageChange={removeImageField.onChange}
                  />
                )}
              />
            )}
          />

          <div className="space-y-1.5">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              autoFocus
              {...register("title")}
              aria-invalid={Boolean(errors.title)}
            />
            <div className="flex items-start justify-between gap-3">
              {errors.title ? (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  The public slug is generated automatically.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="post-category">Category</Label>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={categoriesQuery.isLoading}
                  >
                    <SelectTrigger
                      id="post-category"
                      className="w-full"
                      aria-invalid={Boolean(errors.category_id)}
                    >
                      <SelectValue>
                        {(categoriesQuery.data ?? []).find(
                          (category) => category.id === field.value,
                        )?.name ?? "Select category"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(categoriesQuery.data ?? []).map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category_id ? (
                <p className="text-xs text-destructive">
                  {errors.category_id.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="post-status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="post-status" className="w-full">
                      <SelectValue>
                        {field.value === "published" ? "Published" : "Draft"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {role === "admin" ? (
            <div className="space-y-1.5">
              <Label htmlFor="post-author">Author</Label>
              <Controller
                name="user_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={assigneesQuery.isLoading}
                  >
                    <SelectTrigger
                      id="post-author"
                      className="w-full"
                      aria-invalid={Boolean(errors.user_id)}
                    >
                      <SelectValue>
                        {(assigneesQuery.data ?? []).find(
                          (author) => author.id === field.value,
                        )?.name ?? "Select author"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(assigneesQuery.data ?? []).map((author) => (
                        <SelectItem key={author.id} value={String(author.id)}>
                          {author.name} · {author.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.user_id ? (
                <p className="text-xs text-destructive">
                  {errors.user_id.message}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Admins can assign or transfer ownership of any post.
                </p>
              )}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="post-excerpt">Excerpt</Label>
            <Textarea
              id="post-excerpt"
              rows={3}
              placeholder="A short summary for article cards."
              {...register("excerpt")}
              aria-invalid={Boolean(errors.excerpt)}
            />
            {errors.excerpt ? (
              <p className="text-xs text-destructive">
                {errors.excerpt.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post-content">Content</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <MarkdownEditor
                  id="post-content"
                  name={field.name}
                  value={field.value}
                  placeholder="Write the article in Markdown..."
                  disabled={isPending}
                  ariaInvalid={Boolean(errors.content)}
                  ariaDescribedBy={
                    errors.content ? "post-content-error" : undefined
                  }
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
            />
            {errors.content ? (
              <p
                id="post-content-error"
                className="text-xs text-destructive"
              >
                {errors.content.message}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Use the toolbar or type Markdown directly. The preview matches
                the public article renderer.
              </p>
            )}
          </div>
        </form>

        <SheetFooter className="flex-row border-t border-slate-100 px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="post-editor-form"
            disabled={isPending || hasOptionsError}
            className="flex-1 sm:flex-none"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {mode === "create" ? "Create post" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
