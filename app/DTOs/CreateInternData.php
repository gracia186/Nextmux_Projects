<?php

namespace App\DTOs;

use Carbon\Carbon;

final readonly class CreateInternData
{
    public function __construct(
        public string $name,
        public string $email,
        public Carbon $startDate,
        public Carbon $endDate,
        public ?string $mentorId = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            startDate: Carbon::parse($data['start_date']),
            endDate: Carbon::parse($data['end_date']),
            mentorId: $data['mentor_id'] ?? null,
        );
    }
}