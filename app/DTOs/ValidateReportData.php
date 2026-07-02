<?php

namespace App\DTOs;

use App\Enums\ReportStatus;

final readonly class ValidateReportData
{
    public function __construct(
        public ReportStatus $status,
        public string $validatedBy,
        public ?string $mentorComment = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            status: ReportStatus::from($data['status']),
            validatedBy: $data['validated_by'],
            mentorComment: $data['mentor_comment'] ?? null,
        );
    }
}