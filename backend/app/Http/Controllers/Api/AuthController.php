<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Handle user login via Sanctum cookie session.
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return ApiResponse::error("Invalid login credentials", null, 401);
        }

        $request->session()->regenerate();

        return ApiResponse::success(
            new UserResource(Auth::user()),
            "Login successful!",
        );
    }

    /**
     * Handle user logout by invalidating the session.
     */
    public function logout(Request $request)
    {
        Auth::guard("web")->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

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
