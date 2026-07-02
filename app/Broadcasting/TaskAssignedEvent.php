<?php

namespace App\Broadcasting;

use App\Models\Task;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskAssignedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Task $task,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('intern.'.$this->task->assigned_to),
        ];
    }

    public function broadcastAs(): string
    {
        return 'task.assigned';
    }

    public function broadcastWith(): array
    {
        return [
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'project_name' => $this->task->project->title,
        ];
    }
}