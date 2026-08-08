<?php

namespace App\Http\Requests\PostRequest;

use App\Models\Post;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can("create", Post::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "user_id" => [
                "sometimes",
                "required",
                "integer",
                "exists:users,id",
                Rule::prohibitedIf(fn() => $this->user()?->role !== "admin"),
            ],
            "category_id" => ["required", "exists:categories,id"],
            "title" => ["required", "string", "max:255", "unique:posts,title"],
            "excerpt" => ["nullable", "string"],
            "content" => ["required", "string"],
            "status" => ["required", "in:draft,published"],
        ];
    }
}
