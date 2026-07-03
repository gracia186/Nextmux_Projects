<?php

namespace App\DTOs;

use App\Enums\AttendanceStatus;
use Carbon\Carbon;

final readonly class AttendanceData
{
    public function __construct(
        public string $internId,
        public string $internshipId,
        public Carbon $date,
        public AttendanceStatus $status,
        public ?string $note = null,
        public ?string $recordedBy = null,
        public ?string $arrivalTime = null,
        public ?string $departureTime = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            internId: $data['intern_id'],
            internshipId: $data['internship_id'],
            date: Carbon::parse($data['date'] ?? now()),
            status: AttendanceStatus::from($data['status']),
            note: $data['note'] ?? null,
            recordedBy: $data['recorded_by'] ?? null,
            arrivalTime: $data['arrival_time'] ?? null,
            departureTime: $data['departure_time'] ?? null,
        );
    }
}