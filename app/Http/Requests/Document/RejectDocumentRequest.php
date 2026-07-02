<?php

namespace App\Http\Requests\Document;

use Illuminate\Foundation\Http\FormRequest;

class RejectDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'rejection_reason.required' => 'Un motif de rejet est obligatoire.',
        ];
    }
}