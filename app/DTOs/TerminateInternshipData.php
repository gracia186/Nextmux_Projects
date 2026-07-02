<?php

namespace App\DTOs;

final readonly class TerminateInternshipData
{
    public function __construct(
        public string $internshipId,
        public string $reason,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            internshipId: $data['internship_id'],
            reason: $data['reason'],
        );
    }
}