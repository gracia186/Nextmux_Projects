<?php

namespace App\Actions\Project;

use App\Exceptions\InternNotAssignedToMentorException;
use App\Models\Project;
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

        $project->interns()->syncWithoutDetaching($internIds);

        return $project->fresh(['interns']);
    }
}