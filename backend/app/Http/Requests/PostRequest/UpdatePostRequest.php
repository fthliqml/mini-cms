<?php

namespace App\Http\Requests\PostRequest;

use App\Models\Post;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $post = $this->route("post");

        return $post instanceof Post &&
            ($this->user()?->can("update", $post) ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $postId = $this->route("post")?->id ?? $this->route("post");

        return [
            "user_id" => [
                "sometimes",
                "required",
                "integer",
                "exists:users,id",
                Rule::prohibitedIf(fn() => $this->user()?->role !== "admin"),
            ],
            "category_id" => [
                "sometimes",
                "required",
                "exists:categories,id",
            ],
            "title" => [
                "sometimes",
                "required",
                "string",
                "max:255",
                Rule::unique("posts", "title")->ignore($postId),
            ],
            "excerpt" => ["nullable", "string"],
            "content" => ["sometimes", "required", "string"],
            "status" => ["sometimes", "required", "in:draft,published"],
        ];
    }
}
