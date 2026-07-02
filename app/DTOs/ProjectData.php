<?php

namespace App\DTOs;

use Carbon\Carbon;

final readonly class ProjectData
{
    public function __construct(
        public string $mentorId,
        public string $title,
        public string $description,
        public ?string $objectives,
        public ?string $deliverables,
        public Carbon $startDate,
        public ?Carbon $endDate,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            mentorId: $data['mentor_id'],
            title: $data['title'],
            description: $data['description'],
            objectives: $data['objectives'] ?? null,
            deliverables: $data['deliverables'] ?? null,
            startDate: Carbon::parse($data['start_date']),
            endDate: isset($data['end_date']) ? Carbon::parse($data['end_date']) : null,
        );
    }
}