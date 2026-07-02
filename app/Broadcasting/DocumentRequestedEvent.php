<?php

namespace App\Broadcasting;

use App\Models\Document;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DocumentRequestedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Document $document,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'document.requested';
    }

    public function broadcastWith(): array
    {
        return [
            'document_id' => $this->document->id,
            'intern_name' => $this->document->intern->name,
            'document_type' => $this->document->type->value,
        ];
    }
}