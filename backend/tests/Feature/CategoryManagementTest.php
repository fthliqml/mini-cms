<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_category_management(): void
    {
        $this->getJson('/api/management/categories')->assertUnauthorized();
    }

    public function test_author_can_read_shared_categories_but_cannot_manage_them(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $category = Category::create([
            'name' => 'Shared category',
            'slug' => 'shared-category',
            'description' => 'Available to every author',
        ]);

        $this->actingAs($author, 'sanctum')
            ->getJson('/api/categories?per_page=100')
            ->assertOk()
            ->assertJsonPath('data.0.id', $category->id);

        $this->actingAs($author, 'sanctum')
            ->getJson('/api/management/categories')
            ->assertForbidden();

        $this->actingAs($author, 'sanctum')
            ->postJson('/api/categories', [])
            ->assertForbidden();

        $this->actingAs($author, 'sanctum')
            ->patchJson("/api/categories/{$category->id}", ['name' => ''])
            ->assertForbidden();

        $this->actingAs($author, 'sanctum')
            ->deleteJson("/api/categories/{$category->id}")
            ->assertForbidden();
    }

    public function test_public_category_counts_only_include_published_posts(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $category = Category::create([
            'name' => 'Public count',
            'slug' => 'public-count',
            'description' => '',
        ]);
        Post::create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'title' => 'Published post',
            'slug' => 'published-post',
            'content' => 'Content',
            'status' => 'published',
        ]);
        Post::create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'title' => 'Draft post',
            'slug' => 'draft-post',
            'content' => 'Content',
            'status' => 'draft',
        ]);

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonPath('data.0.posts_count', 1);

        $this->getJson("/api/categories/{$category->id}")
            ->assertOk()
            ->assertJsonPath('data.posts_count', 1);

        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/management/categories')
            ->assertOk()
            ->assertJsonPath('data.items.0.posts_count', 2);
    }

    public function test_admin_can_search_create_update_and_delete_categories(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Category::create([
            'name' => 'Technology',
            'slug' => 'technology',
            'description' => 'Hardware and software',
        ]);
        Category::create([
            'name' => 'Career',
            'slug' => 'career',
            'description' => 'Professional development',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/management/categories?search=software')
            ->assertOk()
            ->assertJsonPath('data.pagination.total', 1)
            ->assertJsonPath('data.items.0.name', 'Technology');

        $response = $this->actingAs($admin, 'sanctum')->postJson(
            '/api/categories',
            [
                'name' => 'Editorial',
                'description' => 'Editorial guidance',
            ],
        );

        $response
            ->assertCreated()
            ->assertJsonPath('data.slug', 'editorial')
            ->assertJsonPath('data.posts_count', 0);
        $categoryId = $response->json('data.id');

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/categories/{$categoryId}", [
                'name' => 'Editorial notes',
                'description' => null,
            ])
            ->assertOk()
            ->assertJsonPath('data.slug', 'editorial-notes')
            ->assertJsonPath('data.description', '');

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/categories/{$categoryId}")
            ->assertOk();

        $this->assertDatabaseMissing('categories', ['id' => $categoryId]);
    }

    public function test_category_in_use_cannot_be_deleted(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $author = User::factory()->create(['role' => 'author']);
        $category = Category::create([
            'name' => 'In use',
            'slug' => 'in-use',
            'description' => '',
        ]);
        Post::create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'title' => 'Using category',
            'slug' => 'using-category',
            'content' => 'Content',
            'status' => 'draft',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/categories/{$category->id}")
            ->assertUnprocessable();

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_similar_names_receive_unique_slugs(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Category::create([
            'name' => 'Web Design',
            'slug' => 'web-design',
            'description' => '',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/categories', ['name' => 'Web-Design'])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'web-design-2');
    }
}
