<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    public function test_author_can_upload_and_replace_their_post_image(): void
    {
        Storage::fake("public");

        $author = User::factory()->create(["role" => "author"]);
        $category = $this->createCategory();
        $image = UploadedFile::fake()->image("cover.jpg", 1200, 630);

        $response = $this->actingAs($author, "sanctum")->post(
            "/api/posts",
            [
                "category_id" => $category->id,
                "title" => "Post With Cover",
                "content" => "Content",
                "status" => "draft",
                "image" => $image,
            ],
            ["Accept" => "application/json"],
        );

        $response
            ->assertCreated()
            ->assertJsonPath("data.image_url", function ($url) {
                return is_string($url) && str_contains($url, "/storage/posts/");
            });

        $post = Post::where("title", "Post With Cover")->firstOrFail();
        $originalImagePath = $post->image_path;

        Storage::disk("public")->assertExists($originalImagePath);

        $replacement = UploadedFile::fake()->image(
            "replacement.webp",
            1200,
            630,
        );

        $this->actingAs($author, "sanctum")
            ->post(
                "/api/posts/{$post->slug}",
                ["_method" => "PATCH", "image" => $replacement],
                ["Accept" => "application/json"],
            )
            ->assertOk();

        $post->refresh();

        $this->assertNotSame($originalImagePath, $post->image_path);
        Storage::disk("public")->assertMissing($originalImagePath);
        Storage::disk("public")->assertExists($post->image_path);
    }

    public function test_author_can_remove_an_image_and_deleting_a_post_cleans_up_the_file(): void
    {
        Storage::fake("public");

        $author = User::factory()->create(["role" => "author"]);
        $category = $this->createCategory();
        $post = $this->createPost($author, $category, "Remove Cover");
        $firstImagePath = UploadedFile::fake()
            ->image("first.jpg", 1200, 630)
            ->store("posts", "public");

        $post->update(["image_path" => $firstImagePath]);

        $this->actingAs($author, "sanctum")
            ->post(
                "/api/posts/{$post->slug}",
                ["_method" => "PATCH", "remove_image" => "1"],
                ["Accept" => "application/json"],
            )
            ->assertOk()
            ->assertJsonPath("data.image_url", null);

        $post->refresh();

        $this->assertNull($post->image_path);
        Storage::disk("public")->assertMissing($firstImagePath);

        $secondImagePath = UploadedFile::fake()
            ->image("second.jpg", 1200, 630)
            ->store("posts", "public");

        $post->update(["image_path" => $secondImagePath]);

        $this->actingAs($author, "sanctum")
            ->deleteJson("/api/posts/{$post->slug}")
            ->assertOk();

        Storage::disk("public")->assertMissing($secondImagePath);
    }

    public function test_post_image_rejects_unsupported_files(): void
    {
        Storage::fake("public");

        $author = User::factory()->create(["role" => "author"]);
        $category = $this->createCategory();

        $this->actingAs($author, "sanctum")
            ->post(
                "/api/posts",
                [
                    "category_id" => $category->id,
                    "title" => "Unsafe Cover",
                    "content" => "Content",
                    "status" => "draft",
                    "image" => UploadedFile::fake()->create(
                        "cover.svg",
                        100,
                        "image/svg+xml",
                    ),
                ],
                ["Accept" => "application/json"],
            )
            ->assertUnprocessable()
            ->assertJsonValidationErrors("image");

        $this->actingAs($author, "sanctum")
            ->post(
                "/api/posts",
                [
                    "category_id" => $category->id,
                    "title" => "Oversized Cover",
                    "content" => "Content",
                    "status" => "draft",
                    "image" => UploadedFile::fake()->image(
                        "wide.jpg",
                        6001,
                        100,
                    ),
                ],
                ["Accept" => "application/json"],
            )
            ->assertUnprocessable()
            ->assertJsonValidationErrors("image");
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
