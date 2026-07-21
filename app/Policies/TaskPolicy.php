<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function create(User $user, Task $task): bool
    {
        $task->loadMissing('project');

        return $user->isMentor() && $task->project->mentor_id === $user->id;
    }

    public function view(User $user, Task $task): bool
    {
        $task->loadMissing('project', 'interns');

        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isMentor()) {
            return $task->project->mentor_id === $user->id;
        }

        return $task->interns->contains('id', $user->id);
    }

    public function update(User $user, Task $task): bool
    {
        $task->loadMissing('project');

        return $user->isMentor() && $task->project->mentor_id === $user->id;
    }

    public function updateStatus(User $user, Task $task): bool
    {
        $task->loadMissing('interns');

        return $user->isIntern() && $task->interns->contains('id', $user->id);
    }

    public function delete(User $user, Task $task): bool
    {
        $task->loadMissing('project');

        return $user->isMentor() && $task->project->mentor_id === $user->id;
    }
}