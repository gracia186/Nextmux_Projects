<?php

namespace App\Repositories;

use App\Models\Attendance;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use Illuminate\Support\Collection;

class AttendanceRepository implements AttendanceRepositoryInterface
{
    public function find(string $id): ?Attendance
    {
        return Attendance::find($id);
    }

    public function existsForDate(string $internId, string $date): bool
    {
        return Attendance::where('intern_id', $internId)
            ->where('date', $date)
            ->exists();
    }

    public function create(array $data): Attendance
    {
        return Attendance::create($data);
    }

    public function update(Attendance $attendance, array $data): Attendance
    {
        $attendance->update($data);

        return $attendance->fresh();
    }

    public function historyForIntern(string $internId): Collection
    {
        return Attendance::where('intern_id', $internId)
            ->orderBy('date', 'desc')
            ->get();
    }

    public function dashboardForMentor(string $mentorId): Collection
    {
        return Attendance::whereHas('internship', function ($query) use ($mentorId) {
            $query->where('mentor_id', $mentorId);
        })
            ->with('intern')
            ->orderBy('date', 'desc')
            ->get();
    }

    public function dashboardGlobal(): Collection
    {
        return Attendance::with('intern')
            ->orderBy('date', 'desc')
            ->limit(500)
            ->get();
    }
}