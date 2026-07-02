<?php

namespace App\Actions\Task;

use App\Enums\TaskStatus;
use App\Enums\UserRole;
use App\Exceptions\UnauthorizedTaskTransitionException;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskStatusUpdatedNotification;
use App\Repositories\Contracts\TaskRepositoryInterface;

class UpdateTaskStatusAction
{
    public function __construct(
        private TaskRepositoryInterface $tasks,
    ) {
    }

    public function execute(Task $task, TaskStatus $newStatus, User $requester): Task
    {
        if ($newStatus === TaskStatus::Todo
            && $task->status === TaskStatus::Done
            && $requester->role !== UserRole::Mentor) {
            throw new UnauthorizedTaskTransitionException(
                'Seul le mentor peut remettre une tâche terminée à "À faire".'
            );
        }

        $data = ['status' => $newStatus->value];

        if ($newStatus === TaskStatus::Done) {
            $data['completed_at'] = now();
        } else {
            $data['completed_at'] = null;
        }

        $updated = $this->tasks->update($task, $data);

        $updated->loadMissing('project.mentor');

        if ($requester->isIntern() && $updated->project->mentor) {
            $updated->project->mentor->notify(new TaskStatusUpdatedNotification($updated));
        }

        return $updated;
    }
}