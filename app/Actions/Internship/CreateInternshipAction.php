<?php

namespace App\Actions\Internship;

use App\DTOs\CreateInternshipData;
use App\Enums\InternshipStatus;
use App\Models\Internship;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use Illuminate\Support\Str;

class CreateInternshipAction
{
    public function __construct(
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function execute(CreateInternshipData $data): Internship
    {
        return $this->internships->create([
            'id' => (string) Str::uuid(),
            'intern_id' => $data->internId,
            'mentor_id' => $data->mentorId,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
            'duration_days' => $data->startDate->diffInDays($data->endDate),
            'status' => InternshipStatus::Active->value,
        ]);
    }
}