<?php

namespace App\Http\Requests\Finance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateImportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'person_id' => ['sometimes', 'integer', 'exists:persons,id'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'reason' => ['sometimes', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
            'date' => ['sometimes', 'date'],
        ];
    }
}
