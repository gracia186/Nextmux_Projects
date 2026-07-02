<?php

namespace App\DTOs;

final readonly class InternshipFeedbackData
{
    public function __construct(
        public string $intern_id,
        public string $internship_id,
        public int $welcome_rating,
        public int $mentorship_rating,
        public int $atmosphere_rating,
        public int $professional_value_rating,
        public int $recommendation_score,
        public ?string $comment,
        public bool $is_anonymous,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            intern_id: $data['intern_id'],
            internship_id: $data['internship_id'],
            welcome_rating: $data['welcome_rating'],
            mentorship_rating: $data['mentorship_rating'],
            atmosphere_rating: $data['atmosphere_rating'],
            professional_value_rating: $data['professional_value_rating'],
            recommendation_score: $data['recommendation_score'],
            comment: $data['comment'] ?? null,
            is_anonymous: $data['is_anonymous'] ?? false,
        );
    }
}
