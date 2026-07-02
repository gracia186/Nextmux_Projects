<?php

namespace App\Broadcasting;

use App\Models\Event;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EventPublishedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Event $event,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('nextmux'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'event.published';
    }

    public function broadcastWith(): array
    {
        return [
            'event_id' => $this->event->id,
            'title' => $this->event->title,
            'audience' => $this->event->audience->value,
            'author' => $this->event->author->name,
        ];
    }
}