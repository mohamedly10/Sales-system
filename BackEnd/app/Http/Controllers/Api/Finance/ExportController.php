<?php

namespace App\Http\Controllers\Api\Finance;

use App\Actions\Finance\CreateExportAction;
use App\Actions\Finance\DeleteExportAction;
use App\Actions\Finance\UpdateExportAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Finance\StoreExportRequest;
use App\Http\Requests\Finance\UpdateExportRequest;
use App\Http\Resources\Finance\ExportCollection;
use App\Http\Resources\Finance\ExportResource;
use App\Models\Finance\Export;

class ExportController extends Controller
{
    public function index()
    {
        return new ExportCollection(Export::with('person')->paginate());
    }

    public function store(StoreExportRequest $request, CreateExportAction $action)
    {
        $export = $action->execute($request->validated());

        return ExportResource::make($export->load('person'));
    }

    public function show(Export $export)
    {
        return ExportResource::make($export->load('person'));
    }

    public function update(UpdateExportRequest $request, Export $export, UpdateExportAction $action)
    {
        $export = $action->execute($export, $request->validated());

        return ExportResource::make($export->load('person'));
    }

    public function destroy(Export $export, DeleteExportAction $action)
    {
        $action->execute($export);

        return response()->noContent();
    }
}
