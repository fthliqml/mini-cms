<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Post extends Model
{
    protected $fillable = [
        "user_id",
        "category_id",
        "title",
        "slug",
        "excerpt",
        "content",
        "image_path",
        "status",
        "published_at",
    ];

    protected $casts = [
        "published_at" => "datetime",
    ];

    public function getRouteKeyName(): string
    {
        return "slug";
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        if (Str::startsWith($this->image_path, ["http://", "https://"])) {
            return $this->image_path;
        }

        return Storage::disk("public")->url($this->image_path);
    }

    public function deleteStoredImage(): void
    {
        if (
            $this->image_path &&
            !Str::startsWith($this->image_path, ["http://", "https://"])
        ) {
            Storage::disk("public")->delete($this->image_path);
        }
    }

    protected static function booted(): void
    {
        static::deleted(fn(Post $post) => $post->deleteStoredImage());
    }
}
