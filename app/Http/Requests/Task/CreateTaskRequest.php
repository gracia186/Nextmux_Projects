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
            'assigned_to' => ['nullable', 'uuid', 'exists:users,id'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'due_date.after_or_equal' => 'La date d\'échéance ne peut pas être dans le passé.',
        ];
    }
}