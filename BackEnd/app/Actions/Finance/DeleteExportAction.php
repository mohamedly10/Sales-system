<?php

namespace App\Actions\Finance;

use App\Models\Finance\Export;

class DeleteExportAction
{
    public function execute(Export $export): ?bool
    {
        $export->person->increment('balance', $export->amount);

        return $export->delete();
    }
}
