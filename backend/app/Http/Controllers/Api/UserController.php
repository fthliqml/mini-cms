<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest\StoreUserRequest;
use App\Http\Requests\UserRequest\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\PaginationData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users (Admin only).
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'role' => [
                'nullable',
                'string',
                Rule::in(User::SUPPORTED_ROLES),
            ],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $users = User::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(
                $filters['role'] ?? null,
                fn ($query, $role) => $query->where('role', $role),
            )
            ->latest()
            ->paginate($filters['per_page'] ?? 10);

        return ApiResponse::success(
            [
                'items' => UserResource::collection($users->items()),
                'pagination' => PaginationData::from($users),
            ],
            'Users retrieved successfully!',
        );
    }

    /**
     * Store a newly created user in storage (Admin only).
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $user = User::create($request->validated());

        return ApiResponse::success(
            new UserResource($user),
            'User created successfully!',
            201,
        );
    }

    /**
     * Display the specified user (Admin only).
     */
    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return ApiResponse::success(
            new UserResource($user),
            'User retrieved successfully!',
        );
    }

    /**
     * Update the specified user in storage (Admin only).
     */
    public function update(
        UpdateUserRequest $request,
        User $user,
    ): JsonResponse {
        $this->authorize('update', $user);

        $validated = $request->validated();

        if (
            $request->user()->is($user) &&
            isset($validated['role']) &&
            $validated['role'] !== User::ROLE_ADMIN
        ) {
            return ApiResponse::error(
                'You cannot remove your own admin role.',
                null,
                422,
            );
        }

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $user->update($validated);

        return ApiResponse::success(
            new UserResource($user),
            'User updated successfully!',
        );
    }

    /**
     * Remove the specified user from storage (Admin only).
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        if ($request->user()->is($user)) {
            return ApiResponse::error(
                'You cannot delete your own account.',
                null,
                422,
            );
        }

        if ($user->posts()->exists()) {
            return ApiResponse::error(
                'User cannot be deleted while they still own posts.',
                null,
                422,
            );
        }

        $user->delete();

        return ApiResponse::success(null, 'User deleted successfully!');
    }
}
