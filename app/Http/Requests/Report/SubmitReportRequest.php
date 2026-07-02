<?php

namespace App\Http\Requests\Report;

use App\Enums\ReportType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubmitReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isIntern();
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(ReportType::class)],
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'period_end.after_or_equal' => 'La date de fin doit être après la date de début.',
            'file.required' => 'Le fichier du rapport est requis.',
            'file.mimes' => 'Seuls les fichiers PDF, JPG et PNG sont acceptés.',
            'file.max' => 'Le fichier ne doit pas dépasser 10 Mo.',
        ];
    }
}