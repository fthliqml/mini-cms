<?php

namespace App\Http\Requests\UserRequest;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
        $userId = $this->route("user")?->id ?? $this->route("user");

        return [
            "name" => ["sometimes", "string", "max:255"],
            "email" => [
                "sometimes",
                "string",
                "email",
                "max:255",
                Rule::unique("users", "email")->ignore($userId),
            ],
            "password" => ["nullable", "string", "min:8"],
            "role" => ["sometimes", "string", "in:admin,author"],
        ];
    }
}
