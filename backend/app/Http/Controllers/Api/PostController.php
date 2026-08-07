<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest\StorePostRequest;
use App\Http\Requests\PostRequest\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with(["author", "category"])
            ->latest()
            ->paginate(10);

        return ApiResponse::success(
            PostResource::collection($posts),
            "Posts retrieved successfully!",
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();

        $post = Post::create([
            ...$validated,
            "user_id" => $request->user()->id,
            "slug" => Str::slug($validated["title"], "-"),
            "excerpt" => $validated["excerpt"] ?? null,
            "published_at" =>
                $validated["status"] === "published" ? now() : null,
        ]);

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
        $validated = $request->validated();

        if (isset($validated["title"])) {
            $validated["slug"] = Str::slug($validated["title"], "-");
        }

        if (isset($validated["status"])) {
            $validated["published_at"] =
                $validated["status"] === "published" ? now() : null;
        }

        $post->update($validated);

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
        $post->delete();

        return ApiResponse::success(null, "Post deleted successfully!");
    }
}
