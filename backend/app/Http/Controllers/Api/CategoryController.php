<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest\StoreCategoryRequest;
use App\Http\Requests\CategoryRequest\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->validate([
            "per_page" => ["nullable", "integer", "min:1", "max:100"],
        ]);
        $categories = Category::withCount("posts")
            ->latest()
            ->paginate($filters["per_page"] ?? 10);

        return ApiResponse::success(
            CategoryResource::collection($categories),
            "Categories retrieved successfully!",
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $this->authorize("create", Category::class);

        $validated = $request->validated();

        $category = Category::create([
            ...$validated,
            "slug" => Str::slug($validated["name"], "-"),
            "description" => $validated["description"] ?? "",
        ]);

        return ApiResponse::success(
            new CategoryResource($category),
            "Category created successfully!",
            201,
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $category->loadCount("posts");

        return ApiResponse::success(
            new CategoryResource($category),
            "Category retrieved successfully!",
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->authorize("update", $category);

        $validated = $request->validated();

        if (isset($validated["name"])) {
            $validated["slug"] = Str::slug($validated["name"], "-");
        }

        $category->update($validated);

        return ApiResponse::success(
            new CategoryResource($category),
            "Category updated successfully!",
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $this->authorize("delete", $category);

        if ($category->posts()->exists()) {
            return ApiResponse::error(
                "Category cannot be deleted because it is being used by posts",
                null,
                422,
            );
        }

        $category->delete();

        return ApiResponse::success(null, "Category deleted successfully!");
    }
}
