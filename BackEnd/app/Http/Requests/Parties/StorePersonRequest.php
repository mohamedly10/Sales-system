<?php

namespace App\Http\Requests\Parties;

use App\Enums\Parties\PersonStatus;
use Illuminate\Foundation\Http\FormRequest;

class StorePersonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:' . implode(',', PersonStatus::values())],
            'notes' => ['nullable', 'string'],
        ];
    }
}
