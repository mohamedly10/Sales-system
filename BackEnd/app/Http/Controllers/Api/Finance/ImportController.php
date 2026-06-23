<?php

namespace App\Http\Controllers\Api\Finance;

use App\Actions\Finance\CreateImportAction;
use App\Actions\Finance\DeleteImportAction;
use App\Actions\Finance\UpdateImportAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Finance\StoreImportRequest;
use App\Http\Requests\Finance\UpdateImportRequest;
use App\Http\Resources\Finance\ImportCollection;
use App\Http\Resources\Finance\ImportResource;
use App\Models\Finance\Import;

class ImportController extends Controller
{
    public function index()
    {
        return new ImportCollection(Import::with('person')->paginate());
    }

    public function store(StoreImportRequest $request, CreateImportAction $action)
    {
        $import = $action->execute($request->validated());

        return ImportResource::make($import->load('person'));
    }

    public function show(Import $import)
    {
        return ImportResource::make($import->load('person'));
    }

    public function update(UpdateImportRequest $request, Import $import, UpdateImportAction $action)
    {
        $import = $action->execute($import, $request->validated());

        return ImportResource::make($import->load('person'));
    }

    public function destroy(Import $import, DeleteImportAction $action)
    {
        $action->execute($import);

        return response()->noContent();
    }
}
