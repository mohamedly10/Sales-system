<?php

namespace App\Actions\Finance;

use App\Models\Finance\Import;

class DeleteImportAction
{
    public function execute(Import $import): ?bool
    {
        return $import->delete();
    }
}
