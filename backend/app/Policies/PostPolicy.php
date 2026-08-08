<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return $user === null ||
            in_array($user->role, ["admin", "author"], true);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Post $post): bool
    {
        if ($post->status === "published") {
            return true;
        }

        if (!$user) {
            return false;
        }

        return $user->role === "admin" ||
            ($user->role === "author" && $post->user_id === $user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ["admin", "author"], true);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Post $post): bool
    {
        return $user->role === "admin" ||
            ($user->role === "author" && $post->user_id === $user->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->role === "admin" ||
            ($user->role === "author" && $post->user_id === $user->id);
    }
}
