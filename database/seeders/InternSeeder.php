<?php

namespace Database\Seeders;

use App\Enums\InternshipStatus;
use App\Enums\UserRole;
use App\Models\Internship;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InternSeeder extends Seeder
{
    public function run(): void
    {
        $mentors = User::where('role', UserRole::Mentor->value)->get();

        foreach ($mentors as $mentor) {
            $interns = User::factory()->intern()->count(3)->create();

            foreach ($interns as $intern) {
                Internship::create([
                    'id' => (string) Str::uuid(),
                    'intern_id' => $intern->id,
                    'mentor_id' => $mentor->id,
                    'start_date' => now()->subMonths(2),
                    'end_date' => now()->addMonths(4),
                    'duration_days' => 120,
                    'status' => InternshipStatus::Active->value,
                ]);
            }
        }
    }
}