<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_users(): void
    {
        $this->getJson('/api/users')->assertUnauthorized();
    }

    public function test_author_cannot_access_or_validate_user_management_requests(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $target = User::factory()->create(['role' => 'author']);

        $this->actingAs($author, 'sanctum')
            ->getJson('/api/users')
            ->assertForbidden();

        $this->actingAs($author, 'sanctum')
            ->postJson('/api/users', [])
            ->assertForbidden();

        $this->actingAs($author, 'sanctum')
            ->patchJson("/api/users/{$target->id}", ['email' => 'invalid'])
            ->assertForbidden();
    }

    public function test_admin_can_filter_and_paginate_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        foreach (range(1, 11) as $index) {
            User::factory()->create([
                'name' => "Writer {$index}",
                'email' => "writer{$index}@example.com",
                'role' => 'author',
            ]);
        }

        $response = $this->actingAs($admin, 'sanctum')->getJson(
            '/api/users?search=Writer&role=author',
        );

        $response
            ->assertOk()
            ->assertJsonCount(10, 'data.items')
            ->assertJsonPath('data.pagination.current_page', 1)
            ->assertJsonPath('data.pagination.last_page', 2)
            ->assertJsonPath('data.pagination.total', 11);
    }

    public function test_admin_can_create_and_update_a_user(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $createResponse = $this->actingAs($admin, 'sanctum')->postJson(
            '/api/users',
            [
                'name' => 'New Author',
                'email' => 'new-author@example.com',
                'password' => 'secret123',
                'role' => 'author',
            ],
        );

        $createResponse
            ->assertCreated()
            ->assertJsonPath('data.email', 'new-author@example.com')
            ->assertJsonPath('data.role', 'author');

        $user = User::where('email', 'new-author@example.com')->firstOrFail();
        $this->assertTrue(Hash::check('secret123', $user->password));

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/users/{$user->id}", [
                'name' => 'Updated Author',
                'role' => 'admin',
            ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Updated Author')
            ->assertJsonPath('data.role', 'admin');
    }

    public function test_admin_cannot_remove_their_own_admin_role(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/users/{$admin->id}", ['role' => 'author'])
            ->assertUnprocessable()
            ->assertJsonPath(
                'message',
                'You cannot remove your own admin role.',
            );
    }

    public function test_admin_cannot_delete_their_own_account(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/users/{$admin->id}")
            ->assertUnprocessable()
            ->assertJsonPath('message', 'You cannot delete your own account.');
    }

    public function test_user_with_posts_must_be_reassigned_before_deletion(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $author = User::factory()->create(['role' => 'author']);
        $category = Category::create([
            'name' => 'Tech',
            'slug' => 'tech',
            'description' => 'Tech posts',
        ]);

        Post::create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'title' => 'Owned Post',
            'slug' => 'owned-post',
            'content' => 'Content',
            'status' => 'draft',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/users/{$author->id}")
            ->assertUnprocessable()
            ->assertJsonPath(
                'message',
                'User cannot be deleted while they still own posts.',
            );

        $this->assertDatabaseHas('users', ['id' => $author->id]);
        $this->assertDatabaseHas('posts', ['user_id' => $author->id]);
    }

    public function test_admin_can_delete_a_user_without_posts(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $author = User::factory()->create(['role' => 'author']);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/users/{$author->id}")
            ->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $author->id]);
    }
}
