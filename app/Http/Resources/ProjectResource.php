<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'mentor' => new UserResource($this->whenLoaded('mentor')),
            'title' => $this->title,
            'description' => $this->description,
            'objectives' => $this->objectives,
            'deliverables' => $this->deliverables,
            'progress' => $this->progress,
            'start_date' => $this->start_date->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'status' => $this->status->value,
            'tasks_count' => $this->whenCounted('tasks'),
            'interns' => UserResource::collection($this->whenLoaded('interns'))
                ->map(function ($intern, $index) {
                    $pivot = $this->interns[$index]->pivot ?? null;

                    return array_merge($intern->resolve(), [
                        'evaluation_score' => $pivot?->evaluation_score,
                        'evaluation_comment' => $pivot?->evaluation_comment,
                        'assigned_at' => $pivot?->assigned_at?->toIso8601String(),
                    ]);
                }),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}