<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest\StoreUserRequest;
use App\Http\Requests\UserRequest\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of users (Admin only).
     */
    public function index(Request $request)
    {
        $this->authorize("viewAny", User::class);

        $filters = $request->validate([
            "search" => ["nullable", "string", "max:100"],
            "role" => ["nullable", "string", "in:admin,author"],
            "page" => ["nullable", "integer", "min:1"],
        ]);

        $users = User::query()
            ->when($filters["search"] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where("name", "like", "%{$search}%")
                        ->orWhere("email", "like", "%{$search}%");
                });
            })
            ->when(
                $filters["role"] ?? null,
                fn($query, $role) => $query->where("role", $role),
            )
            ->latest()
            ->paginate(10);

        return ApiResponse::success(
            [
                "items" => UserResource::collection($users->items()),
                "pagination" => [
                    "current_page" => $users->currentPage(),
                    "last_page" => $users->lastPage(),
                    "per_page" => $users->perPage(),
                    "total" => $users->total(),
                ],
            ],
            "Users retrieved successfully!",
        );
    }

    /**
     * Store a newly created user in storage (Admin only).
     */
    public function store(StoreUserRequest $request)
    {
        $this->authorize("create", User::class);

        $validated = $request->validated();
        $validated["password"] = Hash::make($validated["password"]);

        $user = User::create($validated);

        return ApiResponse::success(
            new UserResource($user),
            "User created successfully!",
            201,
        );
    }

    /**
     * Display the specified user (Admin only).
     */
    public function show(User $user)
    {
        $this->authorize("view", $user);

        return ApiResponse::success(
            new UserResource($user),
            "User retrieved successfully!",
        );
    }

    /**
     * Update the specified user in storage (Admin only).
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize("update", $user);

        $validated = $request->validated();

        if (
            $request->user()->is($user) &&
            isset($validated["role"]) &&
            $validated["role"] !== "admin"
        ) {
            return ApiResponse::error(
                "You cannot remove your own admin role.",
                null,
                422,
            );
        }

        if (!empty($validated["password"])) {
            $validated["password"] = Hash::make($validated["password"]);
        } else {
            unset($validated["password"]);
        }

        $user->update($validated);

        return ApiResponse::success(
            new UserResource($user),
            "User updated successfully!",
        );
    }

    /**
     * Remove the specified user from storage (Admin only).
     */
    public function destroy(User $user)
    {
        $this->authorize("delete", $user);

        if (request()->user()->id === $user->id) {
            return ApiResponse::error(
                "You cannot delete your own account.",
                null,
                422,
            );
        }

        if ($user->posts()->exists()) {
            return ApiResponse::error(
                "User cannot be deleted while they still own posts.",
                null,
                422,
            );
        }

        $user->delete();

        return ApiResponse::success(null, "User deleted successfully!");
    }
}
