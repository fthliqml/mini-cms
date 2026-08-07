<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Technology',
                'description' => 'Latest trends and innovations in the tech world',
            ],
            [
                'name' => 'Programming',
                'description' => 'Tutorials, tips, and best practices for developers',
            ],
            [
                'name' => 'Design',
                'description' => 'UI/UX design principles, tools, and inspiration',
            ],
            [
                'name' => 'DevOps',
                'description' => 'CI/CD, cloud infrastructure, and deployment strategies',
            ],
            [
                'name' => 'Career',
                'description' => 'Career growth, job tips, and industry insights',
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                ...$category,
                'slug' => Str::slug($category['name'], '-'),
            ]);
        }
    }
}
