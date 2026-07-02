<?php

namespace App\Actions\Task;

use App\DTOs\TaskData;
use App\Exceptions\InternNotAssignedToMentorException;
use App\Models\Task;
use App\Notifications\TaskAssignedNotification;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Str;

class CreateTaskAction
{
    public function __construct(
        private TaskRepositoryInterface $tasks,
        private ProjectRepositoryInterface $projects,
    ) {
    }

    public function execute(TaskData $data): Task
    {
        if ($data->assignedTo) {
            $project = $this->projects->find($data->projectId);

            $isAssigned = $project->interns->contains('id', $data->assignedTo);

            if (! $isAssigned) {
                throw new InternNotAssignedToMentorException(
                    'Ce stagiaire n\'est pas assigné à ce projet.'
                );
            }
        }

        $task = $this->tasks->create([
            'id' => (string) Str::uuid(),
            'project_id' => $data->projectId,
            'created_by' => $data->createdBy,
            'assigned_to' => $data->assignedTo,
            'title' => $data->title,
            'description' => $data->description,
            'due_date' => $data->dueDate,
        ]);

        if ($task->assigned_to) {
            $task->loadMissing('assignedTo');
            $task->assignedTo->notify(new TaskAssignedNotification($task));
        }

        return $task;
    }
}