<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function create(User $user): bool
    {
        return $user->isMentor();
    }

    public function view(User $user, Project $project): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isMentor()) {
            return $project->mentor_id === $user->id;
        }

        return $project->interns->contains('id', $user->id);
    }

    public function update(User $user, Project $project): bool
    {
        return $user->isMentor() && $project->mentor_id === $user->id;
    }

    public function assign(User $user, Project $project): bool
    {
        return $this->update($user, $project);
    }

    public function evaluate(User $user, Project $project): bool
    {
        return $this->update($user, $project);
    }
}