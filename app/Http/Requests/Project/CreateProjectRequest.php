<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class CreateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isMentor();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'objectives' => ['nullable', 'string', 'max:2000'],
            'deliverables' => ['nullable', 'string', 'max:2000'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
        ];
    }
}