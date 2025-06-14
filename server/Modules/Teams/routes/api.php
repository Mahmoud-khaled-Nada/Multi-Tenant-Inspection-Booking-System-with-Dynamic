<?php

use Illuminate\Support\Facades\Route;
use Modules\Teams\Http\Controllers\TeamsController;

Route::middleware(['auth:sanctum', \Spatie\Multitenancy\Http\Middleware\NeedsTenant::class])
    ->prefix('v1')
    ->group(function () {
        Route::get('/teams', [TeamsController::class, 'index']);
        Route::post('/teams', [TeamsController::class, 'store']);
    });