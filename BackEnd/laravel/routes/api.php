<?php

use App\Http\Controllers\Api\Finance\ExportController;
use App\Http\Controllers\Api\Finance\ImportController;
use App\Http\Controllers\Api\Parties\PersonController;
use Illuminate\Support\Facades\Route;

Route::apiResource('persons', PersonController::class);
Route::apiResource('exports', ExportController::class);
Route::apiResource('imports', ImportController::class);
