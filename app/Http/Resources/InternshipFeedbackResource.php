<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InternshipFeedbackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'intern' => $this->when(
                ! $this->is_anonymous,
                fn () => new UserResource($this->whenLoaded('intern'))
            ),
            'welcome_rating' => $this->welcome_rating,
            'mentorship_rating' => $this->mentorship_rating,
            'atmosphere_rating' => $this->atmosphere_rating,
            'professional_value_rating' => $this->professional_value_rating,
            'recommendation_score' => $this->recommendation_score,
            'comment' => $this->comment,
            'is_anonymous' => $this->is_anonymous,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}