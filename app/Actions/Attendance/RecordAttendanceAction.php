<?php

namespace App\Actions\Attendance;

use App\DTOs\AttendanceData;
use App\Enums\AttendanceStatus;
use App\Exceptions\AttendanceAlreadyRecordedException;
use App\Exceptions\InternshipNotActiveException;
use App\Exceptions\OutsideAllowedLocationException;
use App\Models\Attendance;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use App\Services\AttendanceService;
use App\Services\GeolocationService;
use Carbon\Carbon;
use Illuminate\Support\Str;

class RecordAttendanceAction
{
    public function __construct(
        private AttendanceRepositoryInterface $attendances,
        private InternshipRepositoryInterface $internships,
        private AttendanceService $attendanceService,
        private GeolocationService $geolocation,
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

        if (! $this->geolocation->isWithinAllowedRadius($data->latitude, $data->longitude)) {
            throw new OutsideAllowedLocationException(
                'Vous n\'êtes pas à l\'endroit indiqué pour marquer votre présence.'
            );
        }

        $arrivalTime = $data->arrivalTime ?? now()->format('H:i');
        $status = $this->resolveStatus($arrivalTime);

        return $this->attendances->create([
            'id' => (string) Str::uuid(),
            'intern_id' => $data->internId,
            'internship_id' => $data->internshipId,
            'date' => $data->date,
            'status' => $status->value,
            'note' => $data->note,
            'arrival_time' => $arrivalTime,
            'latitude' => $data->latitude,
            'longitude' => $data->longitude,
            'late_reason' => $status === AttendanceStatus::Late ? $data->lateReason : null,
            'late_proof_path' => $status === AttendanceStatus::Late ? $data->lateProofPath : null,
            'absence_reason' => $data->absenceReason,
            'recorded_by' => $data->recordedBy,
        ]);
    }

    private function resolveStatus(string $arrivalTime): AttendanceStatus
    {
        $cutoff = Carbon::createFromFormat('H:i', config('attendance.presence_cutoff'));
        $arrival = Carbon::createFromFormat('H:i', substr($arrivalTime, 0, 5));

        return $arrival->gt($cutoff) ? AttendanceStatus::Late : AttendanceStatus::Present;
    }
}