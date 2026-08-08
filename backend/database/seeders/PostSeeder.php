<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $budi = User::where("email", "budi@example.com")->first();
        $andi = User::where("email", "andi@example.com")->first();

        $programming = Category::where("slug", "programming")->first();
        $technology = Category::where("slug", "technology")->first();
        $design = Category::where("slug", "design")->first();
        $devops = Category::where("slug", "devops")->first();
        $career = Category::where("slug", "career")->first();

        $posts = [
            // Budi's posts
            [
                "user_id" => $budi->id,
                "category_id" => $programming->id,
                "title" => "Belajar Laravel dari Nol untuk Pemula",
                "excerpt" =>
                    "Panduan lengkap memulai pengembangan web dengan Laravel, framework PHP paling populer saat ini.",
                "content" =>
                    "Laravel adalah framework PHP yang dirancang untuk membuat pengembangan web menjadi lebih mudah dan menyenangkan. Dalam tutorial ini, kita akan membahas dasar-dasar Laravel mulai dari instalasi, routing, controller, hingga Eloquent ORM.\n\n## Mengapa Laravel?\n\nLaravel menyediakan sintaks yang ekspresif dan elegan. Dengan fitur seperti Artisan CLI, Blade templating, dan migration system, kamu bisa membangun aplikasi web modern dengan cepat.\n\n## Instalasi\n\nPastikan kamu sudah menginstall PHP 8.3+ dan Composer, kemudian jalankan perintah berikut:\n\n```bash\ncomposer create-project laravel/laravel blog-app\n```\n\nSetelah instalasi selesai, jalankan development server dengan `php artisan serve`.",
                "status" => "published",
                "published_at" => now()->subDays(10),
            ],
            [
                "user_id" => $budi->id,
                "category_id" => $programming->id,
                "title" => "Memahami RESTful API dengan Laravel",
                "excerpt" =>
                    "Pelajari cara membangun RESTful API yang scalable menggunakan Laravel dan Sanctum.",
                "content" =>
                    "RESTful API adalah arsitektur yang umum digunakan untuk komunikasi antara frontend dan backend. Laravel menyediakan tools yang sangat baik untuk membangun API.\n\n## Prinsip REST\n\n1. **Stateless**: Setiap request harus mengandung semua informasi yang diperlukan\n2. **Resource-based**: URL merepresentasikan resource\n3. **HTTP Methods**: GET, POST, PUT, PATCH, DELETE\n\n## Implementasi di Laravel\n\nGunakan `php artisan make:controller Api/PostController --resource` untuk membuat controller dengan method CRUD lengkap.",
                "status" => "published",
                "published_at" => now()->subDays(7),
            ],
            [
                "user_id" => $budi->id,
                "category_id" => $technology->id,
                "title" => "Tren Teknologi Web 2026 yang Wajib Diketahui",
                "excerpt" =>
                    "Dari AI-powered development hingga edge computing, inilah tren yang akan mendominasi dunia web.",
                "content" =>
                    "Dunia teknologi web terus berkembang dengan pesat. Tahun 2026 membawa berbagai inovasi yang mengubah cara kita membangun dan mengelola aplikasi web.\n\n## 1. AI-Powered Development\n\nAI coding assistants semakin canggih dan menjadi bagian integral dari workflow developer.\n\n## 2. Edge Computing\n\nDengan edge computing, aplikasi web bisa berjalan lebih cepat karena data diproses lebih dekat dengan pengguna.\n\n## 3. WebAssembly\n\nWASM memungkinkan bahasa pemrograman selain JavaScript berjalan di browser dengan performa mendekati native.",
                "status" => "published",
                "published_at" => now()->subDays(3),
            ],
            [
                "user_id" => $budi->id,
                "category_id" => $design->id,
                "title" => "Draft: Panduan UI/UX untuk Developer",
                "excerpt" =>
                    "Tips praktis desain UI/UX yang bisa langsung diterapkan oleh developer.",
                "content" =>
                    "Sebagai developer, memiliki pengetahuan dasar tentang UI/UX sangat penting. Artikel ini masih dalam tahap penulisan.\n\n## Prinsip Dasar\n\n- Consistency\n- Feedback\n- Hierarchy\n- Accessibility",
                "status" => "draft",
                "published_at" => null,
            ],

            // Andi's posts
            [
                "user_id" => $andi->id,
                "category_id" => $programming->id,
                "title" => "React Hooks: useState dan useEffect Explained",
                "excerpt" =>
                    "Memahami dua hooks paling fundamental di React untuk state management dan side effects.",
                "content" =>
                    "React Hooks mengubah cara kita menulis komponen React. Dengan hooks, kita bisa menggunakan state dan fitur React lainnya tanpa menulis class component.\n\n## useState\n\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n`useState` memungkinkan kita menambahkan state ke functional component. Parameter pertama adalah initial value, dan mengembalikan array berisi state value dan setter function.\n\n## useEffect\n\n```jsx\nuseEffect(() => {\n  document.title = `Count: \${count}`;\n}, [count]);\n```\n\n`useEffect` digunakan untuk menangani side effects seperti fetching data, manipulasi DOM, atau subscription.",
                "status" => "published",
                "published_at" => now()->subDays(8),
            ],
            [
                "user_id" => $andi->id,
                "category_id" => $devops->id,
                "title" => "Deploy Laravel ke Production dengan Docker",
                "excerpt" =>
                    "Step-by-step guide untuk deploy aplikasi Laravel menggunakan Docker dan Docker Compose.",
                "content" =>
                    "Docker memudahkan deployment aplikasi dengan memastikan environment yang konsisten antara development dan production.\n\n## Dockerfile\n\n```dockerfile\nFROM php:8.3-fpm\nWORKDIR /var/www/html\nCOPY . .\nRUN composer install --no-dev --optimize-autoloader\n```\n\n## Docker Compose\n\nGunakan docker-compose untuk mengelola multiple container:\n- PHP-FPM\n- Nginx\n- MySQL\n- Redis\n\nDengan konfigurasi yang tepat, deployment menjadi semudah menjalankan `docker-compose up -d`.",
                "status" => "published",
                "published_at" => now()->subDays(5),
            ],
            [
                "user_id" => $andi->id,
                "category_id" => $career->id,
                "title" => "Tips Membangun Portfolio Developer yang Menarik",
                "excerpt" =>
                    "Cara membuat portfolio yang standout dan menarik perhatian recruiter.",
                "content" =>
                    "Portfolio adalah salah satu aset terpenting bagi developer. Portfolio yang baik bisa membuka pintu menuju kesempatan kerja yang lebih baik.\n\n## Yang Harus Ada di Portfolio\n\n1. **Projects showcase** — Tampilkan 3-5 project terbaik\n2. **Tech stack** — Jelaskan teknologi yang kamu kuasai\n3. **About me** — Ceritakan perjalanan kamu sebagai developer\n4. **Contact** — Pastikan mudah dihubungi\n\n## Tips Tambahan\n\n- Gunakan domain custom\n- Pastikan responsive di semua device\n- Tambahkan case study untuk setiap project",
                "status" => "published",
                "published_at" => now()->subDay(),
            ],
            [
                "user_id" => $andi->id,
                "category_id" => $technology->id,
                "title" => "Draft: Perbandingan Database SQL vs NoSQL",
                "excerpt" =>
                    "Kapan harus pakai SQL dan kapan NoSQL? Artikel ini membahas perbandingan keduanya.",
                "content" =>
                    "Pemilihan database adalah keputusan arsitektural yang penting. Artikel ini masih dalam pengerjaan.\n\n## SQL\n- Structured data\n- ACID compliance\n- Contoh: MySQL, PostgreSQL\n\n## NoSQL\n- Flexible schema\n- Horizontal scaling\n- Contoh: MongoDB, Redis",
                "status" => "draft",
                "published_at" => null,
            ],
        ];

        foreach ($posts as $post) {
            Post::create([...$post, "slug" => Str::slug($post["title"], "-")]);
        }
    }
}
