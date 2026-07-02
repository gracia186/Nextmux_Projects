<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => UserRole::Intern->value,
            'status' => UserStatus::Active->value,
            'invitation_accepted_at' => now(),
            'consent_accepted_at' => now(),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Admin->value,
            'email' => 'admin@nextmux.com',
            'name' => 'Administrateur NEXTMUX',
        ]);
    }

    public function mentor(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Mentor->value,
        ]);
    }

    public function intern(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Intern->value,
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => UserStatus::Pending->value,
            'password' => null,
            'invitation_token' => hash('sha256', Str::random(64)),
            'invitation_token_expires_at' => now()->addHours(72),
            'invitation_accepted_at' => null,
        ]);
    }
}