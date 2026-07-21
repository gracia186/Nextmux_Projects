<?php

namespace App\DTOs;

use Carbon\Carbon;

final readonly class PermissionData
{
    public function __construct(
        public string $internId,
        public string $internshipId,
        public Carbon $date,
        public string $reason,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            internId: $data['intern_id'],
            internshipId: $data['internship_id'],
            date: Carbon::parse($data['date']),
            reason: $data['reason'],
        );
    }
}