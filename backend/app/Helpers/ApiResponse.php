<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'Success',
        int $statusCode = 200,
    ): JsonResponse {
        return response()->json(
            [
                'status' => true,
                'message' => $message,
                'data' => $data,
            ],
            $statusCode,
        );
    }

    public static function error(
        string $message = 'Something went wrong',
        mixed $data = null,
        int $statusCode = 400,
    ): JsonResponse {
        return response()->json(
            [
                'status' => false,
                'message' => $message,
                'data' => $data,
            ],
            $statusCode,
        );
    }
}
