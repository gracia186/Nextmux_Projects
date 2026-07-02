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
            'note' => $this->note,
            'recorded_by' => new UserResource($this->whenLoaded('recordedBy')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}