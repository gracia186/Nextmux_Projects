<?php

namespace App\DTOs;

use App\Enums\TaskStatus;

final readonly class UpdateTaskInternStatusData
{
    public function __construct(
        public string $taskId,
        public string $internId,
        public TaskStatus $status,
    ) {
    }
}