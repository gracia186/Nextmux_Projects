<?php

namespace App\Repositories\Contracts;

use App\Models\Attendance;
use Illuminate\Support\Collection;

interface AttendanceRepositoryInterface
{
    public function find(string $id): ?Attendance;

    public function existsForDate(string $internId, string $date): bool;

    public function create(array $data): Attendance;

    public function update(Attendance $attendance, array $data): Attendance;

    public function historyForIntern(string $internId): Collection;

    public function dashboardForMentor(string $mentorId): Collection;

    public function dashboardGlobal(): Collection;
}