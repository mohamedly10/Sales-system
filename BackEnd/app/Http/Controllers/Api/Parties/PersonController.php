<?php

namespace App\Http\Controllers\Api\Parties;

use App\Actions\Parties\CreatePersonAction;
use App\Actions\Parties\DeletePersonAction;
use App\Actions\Parties\UpdatePersonAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Parties\StorePersonRequest;
use App\Http\Requests\Parties\UpdatePersonRequest;
use App\Http\Resources\Parties\PersonCollection;
use App\Http\Resources\Parties\PersonResource;
use App\Models\Parties\Person;

class PersonController extends Controller
{
    public function index()
    {
        return new PersonCollection(Person::paginate());
    }

    public function store(StorePersonRequest $request, CreatePersonAction $action)
    {
        $person = $action->execute($request->validated());

        return PersonResource::make($person);
    }

    public function show(Person $person)
    {
        return PersonResource::make($person);
    }

    public function update(UpdatePersonRequest $request, Person $person, UpdatePersonAction $action)
    {
        $person = $action->execute($person, $request->validated());

        return PersonResource::make($person);
    }

    public function destroy(Person $person, DeletePersonAction $action)
    {
        $action->execute($person);

        return response()->noContent();
    }
}
