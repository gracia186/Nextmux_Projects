<?php

namespace App\Actions\Intern;

use App\DTOs\TerminateInternshipData;
use App\Enums\InternshipStatus;
use App\Models\Internship;
use App\Repositories\Contracts\InternshipRepositoryInterface;

class TerminateInternshipAction
{
    public function __construct(
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function execute(Internship $internship, TerminateInternshipData $data): Internship
    {
        return $this->internships->update($internship, [
            'status' => InternshipStatus::Terminated->value,
            'termination_reason' => $data->reason,
        ]);
    }
}