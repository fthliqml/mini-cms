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
        $categories = Category::withCount([
            "posts" => fn($query) => $query->where(
                "status",
                "published",
            ),
        ])
            ->latest()
            ->paginate($filters["per_page"] ?? 10);

        return ApiResponse::success(
            CategoryResource::collection($categories),
            "Categories retrieved successfully!",
        );
    }

    /**
     * Display categories available in the authenticated management workspace.
     */
    public function manage(Request $request)
    {
        $this->authorize("manage", Category::class);

        $filters = $request->validate([
            "search" => ["nullable", "string", "max:100"],
            "page" => ["nullable", "integer", "min:1"],
        ]);
        $categories = Category::withCount("posts")
            ->when($filters["search"] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where("name", "like", "%{$search}%")
                        ->orWhere("description", "like", "%{$search}%");
                });
            })
            ->latest("updated_at")
            ->paginate(10);

        return ApiResponse::success(
            [
                "items" => CategoryResource::collection(
                    $categories->items(),
                ),
                "pagination" => [
                    "current_page" => $categories->currentPage(),
                    "last_page" => $categories->lastPage(),
                    "per_page" => $categories->perPage(),
                    "total" => $categories->total(),
                ],
            ],
            "Management categories retrieved successfully!",
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
            "slug" => $this->uniqueSlug($validated["name"]),
            "description" => $validated["description"] ?? "",
        ]);

        $category->loadCount("posts");

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
        $category->loadCount([
            "posts" => fn($query) => $query->where(
                "status",
                "published",
            ),
        ]);

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
            $validated["slug"] = $this->uniqueSlug(
                $validated["name"],
                $category,
            );
        }

        if (
            array_key_exists("description", $validated) &&
            $validated["description"] === null
        ) {
            $validated["description"] = "";
        }

        $category->update($validated);
        $category->loadCount("posts");

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

    private function uniqueSlug(
        string $name,
        ?Category $ignoredCategory = null,
    ): string {
        $baseSlug = Str::slug($name, "-") ?: "category";
        $slug = $baseSlug;
        $suffix = 2;

        while (
            Category::query()
                ->where("slug", $slug)
                ->when(
                    $ignoredCategory,
                    fn($query) => $query->where(
                        "id",
                        "!=",
                        $ignoredCategory->id,
                    ),
                )
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
