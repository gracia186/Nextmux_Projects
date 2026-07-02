<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class AssignProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isMentor();
    }

    public function rules(): array
    {
        return [
            'intern_ids' => ['required', 'array', 'min:1'],
            'intern_ids.*' => ['required', 'uuid', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'intern_ids.required' => 'Au moins un stagiaire doit être sélectionné.',
        ];
    }
}