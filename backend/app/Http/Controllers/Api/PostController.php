<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest\StorePostRequest;
use App\Http\Requests\PostRequest\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with(["author", "category"])
            ->where("status", "published")
            ->latest("published_at")
            ->paginate(10);

        return ApiResponse::success(
            PostResource::collection($posts),
            "Posts retrieved successfully!",
        );
    }

    /**
     * Display posts available in the authenticated management workspace.
     */
    public function manage(Request $request)
    {
        $this->authorize("viewAny", Post::class);

        $filters = $request->validate([
            "search" => ["nullable", "string", "max:100"],
            "status" => ["nullable", "string", "in:draft,published"],
            "category_id" => [
                "nullable",
                "integer",
                "exists:categories,id",
            ],
            "page" => ["nullable", "integer", "min:1"],
        ]);
        $user = $request->user();

        $posts = Post::with(["author", "category"])
            ->when(
                $user->role !== "admin",
                fn($query) => $query->where("user_id", $user->id),
            )
            ->when($filters["search"] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where("title", "like", "%{$search}%")
                        ->orWhere("excerpt", "like", "%{$search}%");
                });
            })
            ->when(
                $filters["status"] ?? null,
                fn($query, $status) => $query->where("status", $status),
            )
            ->when(
                $filters["category_id"] ?? null,
                fn($query, $categoryId) => $query->where(
                    "category_id",
                    $categoryId,
                ),
            )
            ->latest("updated_at")
            ->paginate(10);

        return ApiResponse::success(
            [
                "items" => PostResource::collection($posts->items()),
                "pagination" => [
                    "current_page" => $posts->currentPage(),
                    "last_page" => $posts->lastPage(),
                    "per_page" => $posts->perPage(),
                    "total" => $posts->total(),
                ],
            ],
            "Management posts retrieved successfully!",
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $this->authorize("create", Post::class);

        $validated = $request->validated();
        $imagePath = $request->file("image")?->store("posts", "public");
        $authorId =
            $request->user()->role === "admin"
                ? ($validated["user_id"] ?? $request->user()->id)
                : $request->user()->id;
        unset($validated["user_id"], $validated["image"]);

        try {
            $post = Post::create([
                ...$validated,
                "user_id" => $authorId,
                "slug" => $this->uniqueSlug($validated["title"]),
                "excerpt" => $validated["excerpt"] ?? null,
                "image_path" => $imagePath,
                "published_at" =>
                    $validated["status"] === "published" ? now() : null,
            ]);
        } catch (Throwable $exception) {
            if ($imagePath) {
                Storage::disk("public")->delete($imagePath);
            }

            throw $exception;
        }

        $post->load(["author", "category"]);

        return ApiResponse::success(
            new PostResource($post),
            "Post created successfully!",
            201,
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $this->authorize("view", $post);

        $post->load(["author", "category"]);

        return ApiResponse::success(
            new PostResource($post),
            "Post retrieved successfully!",
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize("update", $post);

        $validated = $request->validated();
        $previousImagePath = $post->image_path;
        $uploadedImagePath = $request->file("image")?->store(
            "posts",
            "public",
        );
        $removeImage = (bool) ($validated["remove_image"] ?? false);

        unset($validated["image"], $validated["remove_image"]);

        if ($request->user()->role !== "admin") {
            unset($validated["user_id"]);
        }

        if (isset($validated["title"])) {
            $validated["slug"] = $this->uniqueSlug(
                $validated["title"],
                $post,
            );
        }

        if (isset($validated["status"])) {
            if ($validated["status"] === "draft") {
                $validated["published_at"] = null;
            } elseif (!$post->published_at) {
                $validated["published_at"] = now();
            }
        }

        if ($uploadedImagePath) {
            $validated["image_path"] = $uploadedImagePath;
        } elseif ($removeImage) {
            $validated["image_path"] = null;
        }

        try {
            $post->update($validated);
        } catch (Throwable $exception) {
            if ($uploadedImagePath) {
                Storage::disk("public")->delete($uploadedImagePath);
            }

            throw $exception;
        }

        if (
            $previousImagePath &&
            $previousImagePath !== $post->image_path
        ) {
            $previousImage = new Post(["image_path" => $previousImagePath]);
            $previousImage->deleteStoredImage();
        }

        $post->load(["author", "category"]);

        return ApiResponse::success(
            new PostResource($post),
            "Post updated successfully!",
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $this->authorize("delete", $post);

        $post->delete();

        return ApiResponse::success(null, "Post deleted successfully!");
    }

    private function uniqueSlug(string $title, ?Post $ignoredPost = null): string
    {
        $baseSlug = Str::slug($title, "-") ?: "post";
        $slug = $baseSlug;
        $suffix = 2;

        while (
            Post::query()
                ->where("slug", $slug)
                ->when(
                    $ignoredPost,
                    fn($query) => $query->where("id", "!=", $ignoredPost->id),
                )
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
