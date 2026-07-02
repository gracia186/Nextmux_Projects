<?php

namespace App\Http\Requests\Report;

use App\Enums\ReportStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ValidateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isMentor();
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['validated', 'rejected'])],
            'mentor_comment' => ['nullable', 'string', 'max:1000', 'required_if:status,rejected'],
        ];
    }

    public function messages(): array
    {
        return [
            'mentor_comment.required_if' => 'Un commentaire est requis en cas de rejet du rapport.',
        ];
    }
}