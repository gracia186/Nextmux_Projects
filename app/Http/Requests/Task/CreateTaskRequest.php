<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class CreateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isMentor();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'intern_ids' => ['required', 'array', 'min:1'],
            'intern_ids.*' => ['uuid', 'exists:users,id'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'intern_ids.required' => 'Sélectionnez au moins un stagiaire pour cette tâche.',
            'due_date.after_or_equal' => 'La date d\'échéance ne peut pas être dans le passé.',
        ];
    }
}