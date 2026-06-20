<?php

namespace App\Actions\Finance;

use App\Models\Finance\Export;

class DeleteExportAction
{
    public function execute(Export $export): ?bool
    {
        return $export->delete();
    }
}
