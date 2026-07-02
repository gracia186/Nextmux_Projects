<?php

namespace App\Actions\Project;

use App\DTOs\EvaluateInternData;
use App\Models\Project;
use App\Models\ProjectIntern;
use App\Exceptions\InternNotAssignedToMentorException;

class EvaluateInternAction
{
    public function execute(Project $project, EvaluateInternData $data): ProjectIntern
    {
        $pivot = $project->interns()
            ->where('users.id', $data->internId)
            ->first()
            ?->pivot;

        if (! $pivot) {
            throw new InternNotAssignedToMentorException(
                'Ce stagiaire n\'est pas assigné à ce projet.'
            );
        }

        $pivot->update([
            'evaluation_score' => max(0, min(100, $data->score)),
            'evaluation_comment' => $data->comment,
            'evaluated_at' => now(),
        ]);

        return $pivot->fresh();
    }
}