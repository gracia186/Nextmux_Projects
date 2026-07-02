<?php

namespace App\Actions\Project;

use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;

class UpdateProjectProgressAction
{
    public function __construct(
        private ProjectRepositoryInterface $projects,
    ) {
    }

    public function execute(Project $project, int $progress): Project
    {
        $progress = max(0, min(100, $progress));

        $data = ['progress' => $progress];

        if ($progress === 100) {
            $data['status'] = ProjectStatus::Completed->value;
        }

        return $this->projects->update($project, $data);
    }
}