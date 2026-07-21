<?php

namespace App\Http\Requests\Permission;

use Illuminate\Foundation\Http\FormRequest;

class RequestPermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isIntern();
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date', 'after_or_equal:today'],
            'reason' => ['required', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'date.after_or_equal' => 'La date de permission doit être aujourd\'hui ou dans le futur.',
            'reason.required' => 'Le motif de la demande est requis.',
        ];
    }
}