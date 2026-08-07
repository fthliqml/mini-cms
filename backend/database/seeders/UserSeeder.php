<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            "name" => "Admin User",
            "email" => "admin@example.com",
            "password" => "password",
            "role" => "admin",
        ]);

        User::factory()->create([
            "name" => "Budi Santoso",
            "email" => "budi@example.com",
            "password" => "password",
            "role" => "author",
        ]);

        User::factory()->create([
            "name" => "Andi Wijaya",
            "email" => "andi@example.com",
            "password" => "password",
            "role" => "author",
        ]);
    }
}
