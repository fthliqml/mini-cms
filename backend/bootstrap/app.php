<?php

use App\Helpers\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . "/../routes/web.php",
        api: __DIR__ . "/../routes/api.php",
        commands: __DIR__ . "/../routes/console.php",
        health: "/up",
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [EnsureFrontendRequestsAreStateful::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is("api/*"),
        );

        $exceptions->render(function (
            AuthorizationException|AccessDeniedHttpException $e,
            Request $request,
        ) {
            if ($request->is("api/*")) {
                return ApiResponse::error(
                    "You do not have permission to perform this action",
                    null,
                    403,
                );
            }
        });

        $exceptions->render(function (
            AuthenticationException $e,
            Request $request,
        ) {
            if ($request->is("api/*")) {
                return ApiResponse::error("Unauthenticated.", null, 401);
            }
        });
    })
    ->create();
