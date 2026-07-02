<?php

namespace App\Broadcasting;

use App\Models\Document;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DocumentReadyEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Document $document,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('intern.'.$this->document->intern_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'document.ready';
    }

    public function broadcastWith(): array
    {
        return [
            'document_id' => $this->document->id,
            'document_type' => $this->document->type->value,
            'document_number' => $this->document->document_number,
        ];
    }
}