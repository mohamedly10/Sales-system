<?php

namespace App\Http\Resources\Finance;

use App\Http\Resources\Parties\PersonResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'person_id' => $this->person_id,
            'person' => PersonResource::make($this->whenLoaded('person')),
            'amount' => $this->amount,
            'reason' => $this->reason,
            'note' => $this->note,
            'date' => $this->date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
