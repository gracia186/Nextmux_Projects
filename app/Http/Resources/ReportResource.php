<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'intern' => new UserResource($this->whenLoaded('intern')),
            'type' => $this->type->value,
            'period_start' => $this->period_start->toDateString(),
            'period_end' => $this->period_end->toDateString(),
            'file_name' => $this->file_name,
            'file_size' => $this->file_size,
            'status' => $this->status->value,
            'mentor_comment' => $this->mentor_comment,
            'validated_by' => new UserResource($this->whenLoaded('validatedBy')),
            'validated_at' => $this->validated_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}