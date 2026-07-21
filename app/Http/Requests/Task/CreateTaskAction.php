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
        $project = $this->projects->find($data->projectId);

        $assignedProjectInternIds = $project->interns->pluck('id')->all();

        foreach ($data->internIds as $internId) {
            if (! in_array($internId, $assignedProjectInternIds, true)) {
                throw new InternNotAssignedToMentorException(
                    'Un ou plusieurs stagiaires sélectionnés ne sont pas assignés à ce projet.'
                );
            }
        }

        $task = $this->tasks->create([
            'id' => (string) Str::uuid(),
            'project_id' => $data->projectId,
            'created_by' => $data->createdBy,
            'title' => $data->title,
            'description' => $data->description,
            'due_date' => $data->dueDate,
        ]);

        $task->interns()->attach($data->internIds);

        $task->loadMissing('interns');

        foreach ($task->interns as $intern) {
            $intern->notify(new TaskAssignedNotification($task));
        }

        return $task;
    }
}