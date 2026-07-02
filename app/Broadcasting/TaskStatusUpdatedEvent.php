<?php

namespace App\Broadcasting;

use App\Models\Task;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskStatusUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Task $task,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('mentor.'.$this->task->project->mentor_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'task.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'new_status' => $this->task->status->value,
            'intern_name' => $this->task->assignedTo?->name,
        ];
    }
}