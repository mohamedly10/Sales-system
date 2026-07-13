<?php

namespace App\Actions\Finance;

use App\Models\Finance\Export;
use App\Models\Parties\Person;

class CreateExportAction
{
    public function execute(array $data): Export
    {
        $data['code'] = $this->generateCode();

        $export = Export::create($data);

        Person::find($data['person_id'])->decrement('balance', $data['amount']);

        return $export;
    }

    private function generateCode(): string
    {
        $yearMonth = now()->format('ym');
        $last = Export::where('code', 'like', "EXP-{$yearMonth}-%")
            ->max('code');

        $number = $last ? (int) substr($last, -4) + 1 : 1;

        return sprintf("EXP-{$yearMonth}-%04d", $number);
    }
}
