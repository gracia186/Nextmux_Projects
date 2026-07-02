<?php

namespace App\DTOs;

use Carbon\Carbon;

final readonly class TaskData
{
    public function __construct(
        public string $projectId,
        public string $createdBy,
        public ?string $assignedTo,
        public string $title,
        public ?string $description,
        public ?Carbon $dueDate,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            projectId: $data['project_id'],
            createdBy: $data['created_by'],
            assignedTo: $data['assigned_to'] ?? null,
            title: $data['title'],
            description: $data['description'] ?? null,
            dueDate: isset($data['due_date']) ? Carbon::parse($data['due_date']) : null,
        );
    }
}