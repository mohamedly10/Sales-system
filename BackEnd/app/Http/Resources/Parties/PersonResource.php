<?php

namespace App\Http\Resources\Parties;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $importsSum = $this->imports_sum_amount ?? $this->imports()->sum('amount');
        $exportsSum = $this->exports_sum_amount ?? $this->exports()->sum('amount');

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'phone' => $this->phone,
            'company' => $this->company,
            'address' => $this->address,
            'status' => $this->status,
            'balance' => (float)$importsSum - (float)$exportsSum,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
