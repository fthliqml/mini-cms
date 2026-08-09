<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_only_see_published_posts(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $category = Category::create([
            'name' => 'Tech',
            'slug' => 'tech',
            'description' => 'Tech news',
        ]);

        Post::create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'title' => 'Published Post',
            'slug' => 'published-post',
            'content' => 'Content here',
            'status' => 'published',
        ]);

        Post::create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'title' => 'Draft Post',
            'slug' => 'draft-post',
            'content' => 'Draft content',
            'status' => 'draft',
        ]);

        $response = $this->getJson('/api/posts');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.title', 'Published Post');
        $response->assertJsonMissingPath('data.0.author.email');
    }

    public function test_author_cannot_update_other_authors_post(): void
    {
        $author1 = User::factory()->create(['role' => 'author']);
        $author2 = User::factory()->create(['role' => 'author']);

        $category = Category::create([
            'name' => 'Tech',
            'slug' => 'tech',
            'description' => 'Tech news',
        ]);

        $post = Post::create([
            'user_id' => $author1->id,
            'category_id' => $category->id,
            'title' => 'Author 1 Post',
            'slug' => 'author-1-post',
            'content' => 'Content',
            'status' => 'published',
        ]);

        $response = $this->actingAs($author2, 'sanctum')->putJson("/api/posts/{$post->slug}", [
            'title' => 'Updated Title By Author 2',
        ]);

        $response->assertStatus(403);
        $response->assertJson([
            'status' => false,
            'message' => 'You do not have permission to perform this action',
            'data' => null,
        ]);
    }

    public function test_admin_can_update_any_post(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $author = User::factory()->create(['role' => 'author']);

        $category = Category::create([
            'name' => 'Tech',
            'slug' => 'tech',
            'description' => 'Tech news',
        ]);

        $post = Post::create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'title' => 'Author Post',
            'slug' => 'author-post',
            'content' => 'Content',
            'status' => 'published',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/posts/{$post->slug}", [
            'title' => 'Updated Title By Admin',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Updated Title By Admin',
        ]);
    }

    public function test_author_cannot_create_or_update_category(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $category = Category::create([
            'name' => 'Existing',
            'slug' => 'existing',
            'description' => 'Existing category',
        ]);

        $this->actingAs($author, 'sanctum')
            ->postJson('/api/categories', [])
            ->assertForbidden();

        $this->actingAs($author, 'sanctum')
            ->patchJson("/api/categories/{$category->id}", ['name' => ''])
            ->assertForbidden();
    }
}
