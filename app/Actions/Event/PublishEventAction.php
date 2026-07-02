<?php

namespace App\Actions\Event;

use App\DTOs\PublishEventData;
use App\Models\Event;
use App\Repositories\Contracts\EventRepositoryInterface;
use Illuminate\Support\Str;

class PublishEventAction
{
    public function __construct(
        private EventRepositoryInterface $events,
    ) {
    }

    public function execute(PublishEventData $data): Event
    {
        return $this->events->create([
            'id' => (string) Str::uuid(),
            'author_id' => $data->authorId,
            'title' => $data->title,
            'content' => $data->content,
            'audience' => $data->audience->value,
            'is_pinned' => $data->isPinned,
            'published_at' => now(),
        ]);
    }
}