<?php

namespace App\Actions\Parties;

use App\Models\Parties\Person;

class CreatePersonAction
{
    public function execute(array $data): Person
    {
        $data['code'] = $this->generateCode();

        return Person::create($data);
    }

    private function generateCode(): string
    {
        $yearMonth = now()->format('ym');
        $last = Person::where('code', 'like', "PER-{$yearMonth}-%")
            ->max('code');

        $number = $last ? (int) substr($last, -4) + 1 : 1;

        return sprintf("PER-{$yearMonth}-%04d", $number);
    }
}
