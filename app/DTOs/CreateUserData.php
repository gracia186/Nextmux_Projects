<?php

namespace App\DTOs;

use App\Enums\UserRole;

final readonly class CreateUserData
{
    public function __construct(
        public string $name,
        public string $email,
        public UserRole $role,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            role: UserRole::from($data['role']),
        );
    }
}