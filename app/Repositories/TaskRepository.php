<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Collection;

class TaskRepository implements TaskRepositoryInterface
{
    public function find(string $id): ?Task
    {
        return Task::with('interns')->find($id);
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
            ->with('interns', 'createdBy')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function byIntern(string $internId): Collection
    {
        return Task::whereHas('interns', function ($query) use ($internId) {
            $query->where('intern_id', $internId);
        })
            ->with('project', 'interns')
            ->orderBy('due_date', 'asc')
            ->get();
    }

    public function delete(Task $task): bool
    {
        return $task->delete();
    }
}