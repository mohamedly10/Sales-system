<?php

namespace App\Actions\Finance;

use App\Models\Finance\Export;

class UpdateExportAction
{
    public function execute(Export $export, array $data): Export
    {
        $export->fill($data);
        $export->save();

        return $export;
    }
}
