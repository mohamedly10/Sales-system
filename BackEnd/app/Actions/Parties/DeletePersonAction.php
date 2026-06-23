<?php

namespace App\Actions\Parties;

use App\Models\Parties\Person;

class DeletePersonAction
{
    public function execute(Person $person): ?bool
    {
        return $person->delete();
    }
}
