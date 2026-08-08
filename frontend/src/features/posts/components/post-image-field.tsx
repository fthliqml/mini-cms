"use client";

import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostCoverImage } from "./post-cover-image";

interface PostImageFieldProps {
  file?: File;
  existingUrl?: string | null;
  removeImage: boolean;
  disabled?: boolean;
  error?: string;
  onFileChange: (file?: File) => void;
  onRemoveImageChange: (remove: boolean) => void;
}

export function PostImageField({
  file,
  existingUrl,
  removeImage,
  disabled,
  error,
  onFileChange,
  onRemoveImageChange,
}: PostImageFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    },
    [],
  );

  const clearSelectedPreview = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setSelectedPreview(null);
  };

  const handleFileChange = (nextFile?: File) => {
    clearSelectedPreview();

    if (nextFile) {
      const objectUrl = URL.createObjectURL(nextFile);
      objectUrlRef.current = objectUrl;
      setSelectedPreview(objectUrl);
    }

    onFileChange(nextFile);
    onRemoveImageChange(false);
  };

  const handleRemove = () => {
    clearSelectedPreview();
    onFileChange(undefined);
    onRemoveImageChange(Boolean(existingUrl));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const previewUrl = selectedPreview ?? (!removeImage ? existingUrl : null);
  const hasImage = Boolean(previewUrl || file);

  return (
    <div
      className={
        error
          ? "overflow-hidden rounded-xl border border-destructive bg-white"
          : "overflow-hidden rounded-xl border border-slate-200 bg-white"
      }
    >
      <div className="grid gap-0 sm:grid-cols-[13rem_1fr]">
        <PostCoverImage
          src={previewUrl}
          alt="Post cover preview"
          className="aspect-[16/10] border-b border-slate-100 sm:aspect-auto sm:min-h-36 sm:border-b-0 sm:border-r"
        />

        <div className="flex flex-col justify-center p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <ImagePlus className="size-4 text-blue-600" />
            Cover image
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            JPEG, PNG, or WebP. Landscape works best; up to 5 MB and 6000 px.
          </p>

          <Input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={disabled}
            className="sr-only"
            aria-label="Choose post cover image"
            aria-invalid={Boolean(error)}
            onChange={(event) => handleFileChange(event.target.files?.[0])}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-3.5" />
              {hasImage ? "Change image" : "Choose image"}
            </Button>
            {hasImage ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={handleRemove}
                className="text-slate-500 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
                Remove
              </Button>
            ) : null}
          </div>

          {file ? (
            <p className="mt-2 truncate text-[11px] text-slate-400">
              {file.name}
            </p>
          ) : null}
          {error ? (
            <p className="mt-2 text-xs text-destructive">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
