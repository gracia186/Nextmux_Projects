<?php

namespace App\Actions\Intern;

use App\DTOs\CreateInternData;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Internship;
use App\Models\User;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\InternshipDurationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateInternAction
{
    public function __construct(
        private UserRepositoryInterface $users,
        private InternshipRepositoryInterface $internships,
        private InternshipDurationService $durationService,
    ) {
    }

    public function execute(CreateInternData $data): array
    {
        return DB::transaction(function () use ($data) {
            $rawToken = Str::random(64);

            $user = $this->users->create([
                'id' => (string) Str::uuid(),
                'name' => $data->name,
                'email' => $data->email,
                'role' => UserRole::Intern->value,
                'status' => UserStatus::Pending->value,
                'invitation_token' => hash('sha256', $rawToken),
                'invitation_token_expires_at' => now()->addHours(72),
            ]);

            $durationDays = $this->durationService->calculateWorkingDays(
                $data->startDate,
                $data->endDate
            );

            $internship = $this->internships->create([
                'id' => (string) Str::uuid(),
                'intern_id' => $user->id,
                'mentor_id' => $data->mentorId,
                'start_date' => $data->startDate,
                'end_date' => $data->endDate,
                'duration_days' => $durationDays,
            ]);

            return [
                'user' => $user,
                'internship' => $internship,
                'raw_invitation_token' => $rawToken,
            ];
        });
    }
}