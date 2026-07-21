<?php

namespace App\Http\Requests\Permission;

use App\Enums\PermissionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewPermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isMentor();
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in([PermissionStatus::Approved->value, PermissionStatus::Rejected->value])],
            'mentor_comment' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'La décision (approuvé/rejeté) est requise.',
            'status.in' => 'La décision doit être "approved" ou "rejected".',
        ];
    }
}