<?php

namespace App\DTOs;

final readonly class EvaluateInternData
{
    public function __construct(
        public string $internId,
        public int $score,
        public ?string $comment = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            internId: $data['intern_id'],
            score: (int) $data['score'],
            comment: $data['comment'] ?? null,
        );
    }
}