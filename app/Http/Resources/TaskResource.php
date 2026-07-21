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
            'title' => $this->title,
            'description' => $this->description,
            'due_date' => $this->due_date?->toDateString(),
            'interns' => $this->whenLoaded('interns', function () {
                return $this->interns->map(function ($intern) {
                    return [
                        'id' => $intern->id,
                        'name' => $intern->name,
                        'email' => $intern->email,
                        'status' => $intern->pivot->status->value,
                        'completed_at' => $intern->pivot->completed_at?->toIso8601String(),
                    ];
                });
            }),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}