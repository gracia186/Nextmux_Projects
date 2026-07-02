<?php

namespace App\DTOs;

use App\Enums\EventAudience;

final readonly class PublishEventData
{
    public function __construct(
        public string $authorId,
        public string $title,
        public string $content,
        public EventAudience $audience,
        public bool $isPinned = false,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            authorId: $data['author_id'],
            title: $data['title'],
            content: $data['content'],
            audience: EventAudience::from($data['audience']),
            isPinned: $data['is_pinned'] ?? false,
        );
    }
}