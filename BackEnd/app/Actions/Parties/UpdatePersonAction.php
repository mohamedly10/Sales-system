<?php

namespace App\Actions\Parties;

use App\Models\Parties\Person;

class UpdatePersonAction
{
    public function execute(Person $person, array $data): Person
    {
        $person->fill($data);
        $person->save();

        return $person;
    }
}
