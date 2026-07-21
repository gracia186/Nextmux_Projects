<?php

namespace App\DTOs;

use Carbon\Carbon;

final readonly class CreateInternshipData
{
    public function __construct(
        public string $internId,
        public string $mentorId,
        public Carbon $startDate,
        public Carbon $endDate,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            internId: $data['intern_id'],
            mentorId: $data['mentor_id'],
            startDate: Carbon::parse($data['start_date']),
            endDate: Carbon::parse($data['end_date']),
        );
    }
}