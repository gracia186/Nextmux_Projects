<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Collection;

class TaskRepository implements TaskRepositoryInterface
{
    public function find(string $id): ?Task
    {
        return Task::find($id);
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);

        return $task->fresh();
    }

    public function byProject(string $projectId): Collection
    {
        return Task::where('project_id', $projectId)
            ->with('assignedTo')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function byIntern(string $internId): Collection
    {
        return Task::where('assigned_to', $internId)
            ->with('project')
            ->orderBy('due_date', 'asc')
            ->get();
    }

    public function delete(Task $task): bool
    {
        return $task->delete();
    }
}