<?php

namespace App\Actions\Attendance;

use App\DTOs\AttendanceData;
use App\Exceptions\AttendanceAlreadyRecordedException;
use App\Exceptions\InternshipNotActiveException;
use App\Models\Attendance;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use App\Services\AttendanceService;
use Illuminate\Support\Str;

class RecordAttendanceAction
{
    public function __construct(
        private AttendanceRepositoryInterface $attendances,
        private InternshipRepositoryInterface $internships,
        private AttendanceService $attendanceService,
    ) {
    }

    public function execute(AttendanceData $data): Attendance
    {
        $internship = $this->internships->find($data->internshipId);

        if (! $internship || ! $this->attendanceService->canRecordAttendance($internship)) {
            throw new InternshipNotActiveException('Ce stage n\'est plus actif, le pointage est impossible.');
        }

        if ($this->attendances->existsForDate($data->internId, $data->date->toDateString())) {
            throw new AttendanceAlreadyRecordedException('Une présence a déjà été enregistrée pour cette date.');
        }

        return $this->attendances->create([
            'id' => (string) Str::uuid(),
            'intern_id' => $data->internId,
            'internship_id' => $data->internshipId,
            'date' => $data->date,
            'status' => $data->status->value,
            'note' => $data->note,
            'recorded_by' => $data->recordedBy,
        ]);
    }
}