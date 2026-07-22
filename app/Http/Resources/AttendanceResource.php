<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'intern' => new UserResource($this->whenLoaded('intern')),
            'date' => $this->date->toDateString(),
            'status' => $this->status->value,
            'arrival_time' => $this->arrival_time?->format('H:i'),
            'departure_time' => $this->departure_time?->format('H:i'),
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'late_reason' => $this->late_reason,
            'late_proof_path' => $this->late_proof_path,
            'absence_reason' => $this->absence_reason,
            'note' => $this->note,
            'recorded_by' => new UserResource($this->whenLoaded('recordedBy')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}