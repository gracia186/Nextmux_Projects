<?php

namespace App\Actions\Attendance;

use App\Models\User;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use App\Services\AttendanceService;

class GetAttendanceDashboardAction
{
    public function __construct(
        private AttendanceRepositoryInterface $attendances,
        private AttendanceService $attendanceService,
    ) {
    }

    public function execute(User $requester): array
    {
        $attendances = match (true) {
            $requester->isAdmin() => $this->attendances->dashboardGlobal(),
            $requester->isMentor() => $this->attendances->dashboardForMentor($requester->id),
            default => $this->attendances->historyForIntern($requester->id),
        };

        return [
            'attendances' => $attendances,
            'stats' => $this->attendanceService->buildDashboardStats($attendances),
        ];
    }
}