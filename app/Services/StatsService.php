<?php

namespace App\Services;

use App\Enums\DocumentStatus;
use App\Enums\InternshipStatus;
use App\Enums\ReportStatus;
use App\Models\Attendance;
use App\Models\Document;
use App\Models\Internship;
use App\Models\Report;

class StatsService
{
    public function globalOverview(): array
    {
        return [
            'active_interns' => Internship::where('status', InternshipStatus::Active->value)->count(),
            'completed_internships' => Internship::where('status', InternshipStatus::Completed->value)->count(),
            'pending_reports' => Report::where('status', ReportStatus::Pending->value)->count(),
            'pending_documents' => Document::where('status', DocumentStatus::Pending->value)->count(),
            'average_attendance_rate' => $this->averageAttendanceRate(),
        ];
    }

    public function attendanceStats(): array
    {
        $total = Attendance::count();

        if ($total === 0) {
            return [
                'total' => 0,
                'present_rate' => 0,
                'absent_rate' => 0,
                'late_rate' => 0,
            ];
        }

        return [
            'total' => $total,
            'present_rate' => round((Attendance::where('status', 'present')->count() / $total) * 100, 1),
            'absent_rate' => round((Attendance::where('status', 'absent')->count() / $total) * 100, 1),
            'late_rate' => round((Attendance::where('status', 'late')->count() / $total) * 100, 1),
        ];
    }

    public function reportStats(): array
    {
        return [
            'total' => Report::count(),
            'pending' => Report::where('status', ReportStatus::Pending->value)->count(),
            'validated' => Report::where('status', ReportStatus::Validated->value)->count(),
            'rejected' => Report::where('status', ReportStatus::Rejected->value)->count(),
        ];
    }

    public function documentStats(): array
{
    return [
        'total' => Document::count(),
        'pending' => Document::where('status', DocumentStatus::Pending->value)->count(),
        'mentor_approved' => Document::where('status', DocumentStatus::MentorApproved->value)->count(),
        'mentor_rejected' => Document::where('status', DocumentStatus::MentorRejected->value)->count(),
        'admin_rejected' => Document::where('status', DocumentStatus::AdminRejected->value)->count(),
        'completed' => Document::where('status', DocumentStatus::Completed->value)->count(),
    ];
}

    private function averageAttendanceRate(): float
    {
        $total = Attendance::count();

        if ($total === 0) {
            return 0;
        }

        $present = Attendance::where('status', 'present')->count();

        return round(($present / $total) * 100, 1);
    }
}