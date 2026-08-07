<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest\StoreUserRequest;
use App\Http\Requests\UserRequest\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of users (Admin only).
     */
    public function index()
    {
        $this->authorize("viewAny", User::class);

        $users = User::latest()->paginate(10);

        return ApiResponse::success(
            UserResource::collection($users),
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

        $user->delete();

        return ApiResponse::success(null, "User deleted successfully!");
    }
}
