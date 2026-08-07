<?php

use App\Http\Controllers\Api\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/user", function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

// Public routes for Posts
Route::get("/posts", [PostController::class, "index"]);
Route::get("/posts/{post}", [PostController::class, "show"]);

// Protected routes for Posts
Route::middleware("auth:sanctum")->group(function () {
    Route::post("/posts", [PostController::class, "store"]);
    Route::put("/posts/{post}", [PostController::class, "update"]);
    Route::patch("/posts/{post}", [PostController::class, "update"]);
    Route::delete("/posts/{post}", [PostController::class, "destroy"]);
});
