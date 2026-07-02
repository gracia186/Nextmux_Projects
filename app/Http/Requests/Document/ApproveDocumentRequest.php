<?php

namespace App\Http\Requests\Document;

use Illuminate\Foundation\Http\FormRequest;

class ApproveDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [];
    }
}