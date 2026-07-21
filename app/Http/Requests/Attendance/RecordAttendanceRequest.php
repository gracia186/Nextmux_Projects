<?php

namespace App\Http\Requests\Attendance;

use Illuminate\Foundation\Http\FormRequest;

class RecordAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isIntern();
    }

    public function rules(): array
    {
        return [
            'date' => ['sometimes', 'date', 'before_or_equal:today'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'late_reason' => ['nullable', 'string', 'max:500'],
            'late_proof' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'date.before_or_equal' => 'Impossible de pointer une date future.',
            'latitude.required' => 'La localisation est requise pour pointer.',
            'longitude.required' => 'La localisation est requise pour pointer.',
            'late_proof.mimes' => 'Le justificatif doit être une image ou un PDF.',
            'late_proof.max' => 'Le justificatif ne doit pas dépasser 5 Mo.',
        ];
    }
}