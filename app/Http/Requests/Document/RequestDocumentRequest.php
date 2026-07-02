<?php

namespace App\Http\Requests\Document;

use App\Enums\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RequestDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isIntern();
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(DocumentType::class)],
            'request_note' => ['nullable', 'string', 'max:1000'],
        ];
    }
}