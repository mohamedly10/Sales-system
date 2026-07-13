<?php

namespace App\Actions\Parties;

use App\Models\Parties\Person;

class DeletePersonAction
{
    public function execute(Person $person): ?bool
    {
        // Delete related exports and imports first to avoid foreign key constraint violation
        $person->exports()->delete();
        $person->imports()->delete();

        return $person->delete();
    }
}