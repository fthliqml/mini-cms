<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Handle user login via Sanctum cookie session.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        if (! Auth::attempt($credentials)) {
            return ApiResponse::error('Invalid login credentials', null, 401);
        }

        $user = Auth::user();

        if (! ($user instanceof User) || ! $user->hasSupportedRole()) {
            $this->invalidateSession($request);

            return ApiResponse::error(
                'This account does not have a supported role',
                null,
                403,
            );
        }

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return ApiResponse::success(
            new UserResource($user),
            'Login successful!',
        );
    }

    /**
     * Handle user logout by invalidating the session.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->invalidateSession($request);

        return ApiResponse::success(null, 'Logout successful!');
    }

    /**
     * Get the authenticated user profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! ($user instanceof User) || ! $user->hasSupportedRole()) {
            $this->invalidateSession($request);

            return ApiResponse::error(
                'This account does not have a supported role',
                null,
                403,
            );
        }

        return ApiResponse::success(
            new UserResource($user),
            'User profile retrieved successfully!',
        );
    }

    private function invalidateSession(Request $request): void
    {
        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
    }
}
