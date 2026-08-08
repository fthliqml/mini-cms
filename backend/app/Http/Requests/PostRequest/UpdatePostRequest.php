<?php

namespace App\Http\Requests\PostRequest;

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
        return true;
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
            "category_id" => ["sometimes", "exists:categories,id"],
            "title" => [
                "sometimes",
                "string",
                "max:255",
                Rule::unique("posts", "title")->ignore($postId),
            ],
            "excerpt" => ["nullable", "string"],
            "content" => ["sometimes", "string"],
            "status" => ["sometimes", "in:draft,published"],
        ];
    }
}
