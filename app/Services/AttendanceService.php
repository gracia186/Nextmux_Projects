<?php

namespace App\Services;

use App\Enums\AttendanceStatus;
use App\Models\Internship;
use Illuminate\Support\Collection;

class AttendanceService
{
    public function buildDashboardStats(Collection $attendances): array
    {
        $total = $attendances->count();

        if ($total === 0) {
            return [
                'total' => 0,
                'present_rate' => 0,
                'absent_rate' => 0,
                'late_rate' => 0,
            ];
        }

        $present = $attendances->where('status', AttendanceStatus::Present)->count();
        $absent = $attendances->where('status', AttendanceStatus::Absent)->count();
        $late = $attendances->where('status', AttendanceStatus::Late)->count();

        return [
            'total' => $total,
            'present_rate' => round(($present / $total) * 100, 1),
            'absent_rate' => round(($absent / $total) * 100, 1),
            'late_rate' => round(($late / $total) * 100, 1),
        ];
    }

    public function hasRepeatedUnjustifiedAbsences(Collection $attendances, int $threshold = 3): bool
    {
        $recentAbsences = $attendances
            ->where('status', AttendanceStatus::Absent)
            ->sortByDesc('date')
            ->take($threshold);

        if ($recentAbsences->count() < $threshold) {
            return false;
        }

        $dates = $recentAbsences->pluck('date')->sort()->values();

        for ($i = 1; $i < $dates->count(); $i++) {
            $diff = $dates[$i]->diffInDays($dates[$i - 1]);

            if ($diff > 7) {
                return false;
            }
        }

        return true;
    }

    public function canRecordAttendance(Internship $internship): bool
    {
        return $internship->status->value === 'active';
    }
}