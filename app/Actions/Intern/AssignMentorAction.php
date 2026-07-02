<?php

namespace App\Actions\Intern;

use App\Models\Internship;
use App\Repositories\Contracts\InternshipRepositoryInterface;

class AssignMentorAction
{
    public function __construct(
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function execute(Internship $internship, string $mentorId): Internship
    {
        return $this->internships->update($internship, [
            'mentor_id' => $mentorId,
        ]);
    }
}