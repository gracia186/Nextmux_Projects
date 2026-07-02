<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'created_by' => new UserResource($this->whenLoaded('createdBy')),
            'assigned_to' => new UserResource($this->whenLoaded('assignedTo')),
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status->value,
            'due_date' => $this->due_date?->toDateString(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}