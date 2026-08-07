<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user login and token generation.
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        $user = User::where("email", $credentials["email"])->first();

        if (!$user || !Hash::check($credentials["password"], $user->password)) {
            return ApiResponse::error("Invalid login credentials", null, 401);
        }

        $token = $user->createToken("auth_token")->plainTextToken;

        return ApiResponse::success(
            [
                "user" => new UserResource($user),
                "token" => $token,
            ],
            "Login successful!",
        );
    }

    /**
     * Handle user logout by revoking the current access token.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success(null, "Logout successful!");
    }

    /**
     * Get the authenticated user profile.
     */
    public function me(Request $request)
    {
        return ApiResponse::success(
            new UserResource($request->user()),
            "User profile retrieved successfully!",
        );
    }
}
