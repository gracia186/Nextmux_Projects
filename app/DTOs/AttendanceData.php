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
        public ?string $note = null,
        public ?string $recordedBy = null,
        public ?string $arrivalTime = null,
        public ?string $departureTime = null,
        public ?string $lateReason = null,
        public ?string $absenceReason = null,
        public ?float $latitude = null,
        public ?float $longitude = null,
        public ?string $lateProofPath = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            internId: $data['intern_id'],
            internshipId: $data['internship_id'],
            date: Carbon::parse($data['date'] ?? now()),
            note: $data['note'] ?? null,
            recordedBy: $data['recorded_by'] ?? null,
            arrivalTime: $data['arrival_time'] ?? null,
            departureTime: $data['departure_time'] ?? null,
            lateReason: $data['late_reason'] ?? null,
            absenceReason: $data['absence_reason'] ?? null,
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
            lateProofPath: $data['late_proof_path'] ?? null,
        );
    }
}