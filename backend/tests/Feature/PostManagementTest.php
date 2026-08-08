<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_management_posts(): void
    {
        $this->getJson("/api/management/posts")->assertUnauthorized();
    }

    public function test_admin_sees_all_posts_while_author_only_sees_their_own(): void
    {
        $admin = User::factory()->create(["role" => "admin"]);
        $author = User::factory()->create(["role" => "author"]);
        $otherAuthor = User::factory()->create(["role" => "author"]);
        $category = $this->createCategory();

        $this->createPost($author, $category, "Own Draft", "draft");
        $this->createPost(
            $otherAuthor,
            $category,
            "Other Published",
            "published",
        );

        $this->actingAs($admin, "sanctum")
            ->getJson("/api/management/posts")
            ->assertOk()
            ->assertJsonCount(2, "data.items")
            ->assertJsonPath("data.pagination.total", 2);

        $this->actingAs($author, "sanctum")
            ->getJson("/api/management/posts")
            ->assertOk()
            ->assertJsonCount(1, "data.items")
            ->assertJsonPath("data.items.0.title", "Own Draft")
            ->assertJsonPath("data.pagination.total", 1);
    }

    public function test_author_is_forbidden_before_validating_another_authors_post(): void
    {
        $author = User::factory()->create(["role" => "author"]);
        $otherAuthor = User::factory()->create(["role" => "author"]);
        $post = $this->createPost(
            $otherAuthor,
            $this->createCategory(),
            "Protected Post",
        );

        $this->actingAs($author, "sanctum")
            ->patchJson("/api/posts/{$post->slug}", ["title" => ""])
            ->assertForbidden();
    }

    public function test_unknown_role_fails_closed_for_post_management(): void
    {
        $user = User::factory()->create(["role" => "reviewer"]);
        $post = $this->createPost(
            $user,
            $this->createCategory(),
            "Unknown Role Draft",
        );

        $this->actingAs($user, "sanctum")
            ->getJson("/api/management/posts")
            ->assertForbidden();

        $this->actingAs($user, "sanctum")
            ->patchJson("/api/posts/{$post->slug}", [
                "title" => "Should Not Change",
            ])
            ->assertForbidden();
    }

    public function test_admin_can_assign_posts_and_slug_collisions_are_resolved(): void
    {
        $admin = User::factory()->create(["role" => "admin"]);
        $author = User::factory()->create(["role" => "author"]);
        $category = $this->createCategory();

        $this->createPost($admin, $category, "Hello World");

        $response = $this->actingAs($admin, "sanctum")->postJson(
            "/api/posts",
            [
                "user_id" => $author->id,
                "category_id" => $category->id,
                "title" => "Hello-World",
                "excerpt" => "Assigned article",
                "content" => "Article content",
                "status" => "draft",
            ],
        );

        $response
            ->assertCreated()
            ->assertJsonPath("data.author.id", $author->id)
            ->assertJsonPath("data.slug", "hello-world-2");

        $this->assertDatabaseHas("posts", [
            "title" => "Hello-World",
            "slug" => "hello-world-2",
            "user_id" => $author->id,
        ]);
    }

    public function test_author_cannot_assign_a_post_to_another_user(): void
    {
        $author = User::factory()->create(["role" => "author"]);
        $otherAuthor = User::factory()->create(["role" => "author"]);
        $category = $this->createCategory();
        $payload = [
            "user_id" => $otherAuthor->id,
            "category_id" => $category->id,
            "title" => "Assigned By Author",
            "content" => "Content",
            "status" => "draft",
        ];

        $this->actingAs($author, "sanctum")
            ->postJson("/api/posts", $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors("user_id");

        unset($payload["user_id"]);

        $this->actingAs($author, "sanctum")
            ->postJson("/api/posts", $payload)
            ->assertCreated()
            ->assertJsonPath("data.author.id", $author->id);
    }

    public function test_admin_can_reassign_and_delete_any_post(): void
    {
        $admin = User::factory()->create(["role" => "admin"]);
        $author = User::factory()->create(["role" => "author"]);
        $otherAuthor = User::factory()->create(["role" => "author"]);
        $post = $this->createPost(
            $author,
            $this->createCategory(),
            "Reassign Me",
        );

        $this->actingAs($admin, "sanctum")
            ->patchJson("/api/posts/{$post->slug}", [
                "user_id" => $otherAuthor->id,
            ])
            ->assertOk()
            ->assertJsonPath("data.author.id", $otherAuthor->id);

        $this->actingAs($author, "sanctum")
            ->deleteJson("/api/posts/{$post->slug}")
            ->assertForbidden();

        $this->actingAs($admin, "sanctum")
            ->deleteJson("/api/posts/{$post->slug}")
            ->assertOk();

        $this->assertDatabaseMissing("posts", ["id" => $post->id]);
    }

    private function createCategory(): Category
    {
        return Category::create([
            "name" => "Editorial",
            "slug" => "editorial",
            "description" => "Editorial posts",
        ]);
    }

    private function createPost(
        User $author,
        Category $category,
        string $title,
        string $status = "draft",
    ): Post {
        return Post::create([
            "user_id" => $author->id,
            "category_id" => $category->id,
            "title" => $title,
            "slug" => str($title)->slug(),
            "excerpt" => "Excerpt",
            "content" => "Content",
            "status" => $status,
            "published_at" => $status === "published" ? now() : null,
        ]);
    }
}
