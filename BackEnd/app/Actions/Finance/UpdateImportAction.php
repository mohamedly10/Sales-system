<?php

namespace App\Actions\Finance;

use App\Models\Finance\Import;

class UpdateImportAction
{
    public function execute(Import $import, array $data): Import
    {
        $import->fill($data);
        $import->save();

        return $import;
    }
}
