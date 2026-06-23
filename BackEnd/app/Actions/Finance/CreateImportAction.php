<?php

namespace App\Actions\Finance;

use App\Models\Finance\Import;

class CreateImportAction
{
    public function execute(array $data): Import
    {
        $data['code'] = $this->generateCode();

        return Import::create($data);
    }

    private function generateCode(): string
    {
        $yearMonth = now()->format('ym');
        $last = Import::where('code', 'like', "IMP-{$yearMonth}-%")
            ->max('code');

        $number = $last ? (int) substr($last, -4) + 1 : 1;

        return sprintf("IMP-{$yearMonth}-%04d", $number);
    }
}
