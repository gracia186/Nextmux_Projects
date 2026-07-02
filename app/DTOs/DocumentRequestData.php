<?php

namespace App\DTOs;

use App\Enums\DocumentType;

final readonly class DocumentRequestData
{
    public function __construct(
        public string $internId,
        public string $internshipId,
        public DocumentType $type,
        public ?string $requestNote = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            internId: $data['intern_id'],
            internshipId: $data['internship_id'],
            type: DocumentType::from($data['type']),
            requestNote: $data['request_note'] ?? null,
        );
    }
}