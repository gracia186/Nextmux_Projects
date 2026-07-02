<?php

namespace App\Repositories;

use App\Models\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use Illuminate\Support\Collection;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function find(string $id): ?Project
    {
        return Project::with(['interns', 'tasks'])->find($id);
    }

    public function create(array $data): Project
    {
        return Project::create($data);
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);

        return $project->fresh();
    }

    public function byMentor(string $mentorId): Collection
    {
        return Project::where('mentor_id', $mentorId)
            ->withCount('tasks')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function forIntern(string $internId): Collection
    {
        return Project::whereHas('interns', function ($query) use ($internId) {
            $query->where('users.id', $internId);
        })
            ->with('mentor')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}