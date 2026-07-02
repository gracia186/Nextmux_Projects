<?php

namespace App\DTOs;

final readonly class AcceptInvitationData
{
    public function __construct(
        public string $token,
        public string $password,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            token: $data['token'],
            password: $data['password'],
        );
    }
}