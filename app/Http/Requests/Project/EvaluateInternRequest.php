<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class EvaluateInternRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isMentor();
    }

    public function rules(): array
    {
        return [
            'score' => ['required', 'integer', 'min:0', 'max:100'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }
}