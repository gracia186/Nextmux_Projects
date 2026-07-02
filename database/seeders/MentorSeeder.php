<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class MentorSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->mentor()->count(3)->create();
    }
}