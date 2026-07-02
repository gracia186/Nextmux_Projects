<?php

namespace App\Http\Requests\InternshipFeedback;

use Illuminate\Foundation\Http\FormRequest;

class SubmitInternshipFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isIntern();
    }

    public function rules(): array
    {
        return [
            'welcome_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'mentorship_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'atmosphere_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'professional_value_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'recommendation_score' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
            'is_anonymous' => ['nullable', 'boolean'],
        ];
    }
}
