<?php

namespace App\Actions\Project;

use App\Exceptions\InternNotAssignedToMentorException;
use App\Models\Project;
use App\Models\ProjectIntern;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use App\Notifications\TaskAssignedNotification;

class AssignProjectToInternsAction
{
    public function __construct(
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function execute(Project $project, array $internIds): Project
    {
        $mentorInternIds = $this->internships
            ->internsByMentor($project->mentor_id)
            ->pluck('intern_id')
            ->toArray();

        foreach ($internIds as $internId) {
            if (! in_array($internId, $mentorInternIds, true)) {
                throw new InternNotAssignedToMentorException(
                    "Le stagiaire {$internId} n'est pas assigné à ce mentor."
                );
            }
        }

        // Note: syncWithoutDetaching()/attach() perform a raw query builder
        // insert on the pivot table and never instantiate the ProjectIntern
        // model, so its UUID-generating "creating" event would never fire.
        // We create each pivot row through Eloquent instead, skipping any
        // intern already assigned to this project.
        $alreadyAssignedIds = $project->interns()->pluck('users.id')->toArray();

        foreach ($internIds as $internId) {
            if (in_array($internId, $alreadyAssignedIds, true)) {
                continue;
            }

            ProjectIntern::create([
                'project_id' => $project->id,
                'intern_id' => $internId,
                'assigned_at' => now(),
            ]);
        }

        return $project->fresh(['interns']);
    }
}