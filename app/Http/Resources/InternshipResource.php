<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InternshipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'intern' => new UserResource($this->whenLoaded('intern')),
            'mentor' => new UserResource($this->whenLoaded('mentor')),
            'start_date' => $this->start_date->toDateString(),
            'end_date' => $this->end_date->toDateString(),
            'duration_days' => $this->duration_days,
            'status' => $this->status->value,
            'termination_reason' => $this->termination_reason,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}