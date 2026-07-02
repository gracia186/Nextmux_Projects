<?php

namespace App\Repositories;

use App\Enums\InternshipStatus;
use App\Models\Internship;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use Illuminate\Support\Collection;

class InternshipRepository implements InternshipRepositoryInterface
{
    public function find(string $id): ?Internship
    {
        return Internship::find($id);
    }

    public function findActiveByIntern(string $internId): ?Internship
    {
        return Internship::where('intern_id', $internId)
            ->where('status', InternshipStatus::Active->value)
            ->first();
    }

    public function create(array $data): Internship
    {
        return Internship::create($data);
    }

    public function update(Internship $internship, array $data): Internship
    {
        $internship->update($data);

        return $internship->fresh();
    }

    public function internsByMentor(string $mentorId): Collection
    {
        return Internship::with('intern')
            ->where('mentor_id', $mentorId)
            ->where('status', InternshipStatus::Active->value)
            ->get();
    }
}