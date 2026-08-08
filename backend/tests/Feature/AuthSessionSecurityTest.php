<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthSessionSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_created_without_an_explicit_role_default_to_author(): void
    {
        $user = User::create([
            "name" => "Safe Default",
            "email" => "safe-default@example.com",
            "password" => "password",
        ]);

        $this->assertSame("author", $user->refresh()->role);
    }

    public function test_account_with_unknown_role_cannot_start_a_session(): void
    {
        User::factory()->create([
            "email" => "reviewer@example.com",
            "password" => "password",
            "role" => "reviewer",
        ]);

        $this->postJson("/api/login", [
            "email" => "reviewer@example.com",
            "password" => "password",
        ])
            ->assertForbidden()
            ->assertJsonPath(
                "message",
                "This account does not have a supported role",
            );
    }

    public function test_existing_session_with_unknown_role_is_rejected(): void
    {
        $user = User::factory()->create(["role" => "reviewer"]);

        $this->actingAs($user, "sanctum")
            ->getJson("/api/me")
            ->assertForbidden()
            ->assertJsonPath(
                "message",
                "This account does not have a supported role",
            );
    }
}
