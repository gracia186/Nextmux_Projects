<?php

namespace App\Broadcasting;

use App\Models\Report;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportValidatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Report $report,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('intern.'.$this->report->intern_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'report.validated';
    }

    public function broadcastWith(): array
    {
        return [
            'report_id' => $this->report->id,
            'status' => $this->report->status->value,
            'mentor_comment' => $this->report->mentor_comment,
        ];
    }
}