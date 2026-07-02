<?php

namespace App\Http\Requests\Document;

use Illuminate\Foundation\Http\FormRequest;

class ValidateDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'rejection_reason' => ['nullable', 'string', 'max:1000', 'required_if:action,reject'],
        ];
    }
}