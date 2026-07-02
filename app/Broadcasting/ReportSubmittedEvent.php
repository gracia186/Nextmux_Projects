<?php

namespace App\Broadcasting;

use App\Models\Report;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportSubmittedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Report $report,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('mentor.'.$this->report->internship->mentor_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'report.submitted';
    }

    public function broadcastWith(): array
    {
        return [
            'report_id' => $this->report->id,
            'intern_name' => $this->report->intern->name,
            'type' => $this->report->type->value,
        ];
    }
}