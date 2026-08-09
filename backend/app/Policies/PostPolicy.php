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
        return $user === null || $user->hasSupportedRole();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Post $post): bool
    {
        if ($post->isPublished()) {
            return true;
        }

        if (! $user) {
            return false;
        }

        return $user->isAdmin() ||
            ($user->isAuthor() && $post->user_id === $user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasSupportedRole();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Post $post): bool
    {
        return $user->isAdmin() ||
            ($user->isAuthor() && $post->user_id === $user->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->isAdmin() ||
            ($user->isAuthor() && $post->user_id === $user->id);
    }
}
