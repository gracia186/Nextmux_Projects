<?php

namespace App\Http\Requests\Document;

use Illuminate\Foundation\Http\FormRequest;

class MentorValidateDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isMentor();
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:approved,rejected'],
            'rejection_reason' => ['required_if:status,rejected', 'string', 'max:500'],
        ];
    }
}