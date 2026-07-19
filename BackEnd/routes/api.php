<?php

use App\Http\Controllers\Api\Finance\ExportController;
use App\Http\Controllers\Api\Finance\ImportController;
use App\Http\Controllers\Api\Parties\PersonController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    Route::apiResource('persons', PersonController::class);
    Route::apiResource('exports', ExportController::class);
    Route::apiResource('imports', ImportController::class);

    Route::get('reports', [App\Http\Controllers\Api\Finance\ReportController::class, 'index']);
    Route::get('reports/persons', [App\Http\Controllers\Api\Finance\ReportController::class, 'persons']);
    Route::get('reports/export', [App\Http\Controllers\Api\Finance\ReportController::class, 'export']);
    Route::get('stats', [App\Http\Controllers\Api\Finance\ReportController::class, 'stats']);
});
