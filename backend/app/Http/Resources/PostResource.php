<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'image_url' => $this->image_url,
            'status' => $this->status,
            'published_at' => $this->published_at,

            'author' => $this->author
                ? new AuthorResource($this->author)
                : null,

            'category' => $this->category
                ? new CategoryResource($this->category)
                : null,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
