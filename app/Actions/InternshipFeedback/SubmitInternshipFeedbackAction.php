<?php

namespace App\Actions\InternshipFeedback;

use App\DTOs\InternshipFeedbackData;
use App\Models\InternshipFeedback;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use App\Repositories\Contracts\InternshipFeedbackRepositoryInterface;
use Illuminate\Support\Str;

class SubmitInternshipFeedbackAction
{
    public function __construct(
        private InternshipFeedbackRepositoryInterface $feedbacks,
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function execute(InternshipFeedbackData $data): InternshipFeedback
    {
        $internship = $this->internships->find($data->internship_id);

        if ($internship === null || $internship->intern_id !== $data->intern_id) {
            throw new \InvalidArgumentException('Internship not found or invalid.');
        }

        return $this->feedbacks->create([
            'id' => (string) Str::uuid(),
            'intern_id' => $data->intern_id,
            'internship_id' => $data->internship_id,
            'welcome_rating' => $data->welcome_rating,
            'mentorship_rating' => $data->mentorship_rating,
            'atmosphere_rating' => $data->atmosphere_rating,
            'professional_value_rating' => $data->professional_value_rating,
            'recommendation_score' => $data->recommendation_score,
            'comment' => $data->comment,
            'is_anonymous' => $data->is_anonymous,
        ]);
    }
}
