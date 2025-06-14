<?php

use Illuminate\Support\Facades\Route;
use Modules\Teams\Http\Controllers\TeamsController;

Route::middleware(['auth:sanctum', \Spatie\Multitenancy\Http\Middleware\NeedsTenant::class])
    ->prefix('v1')
    ->group(function ()
    {
        Route::get('/teams', [TeamsController::class, 'index']);
        Route::get('/team/{id}', [TeamsController::class, 'find']);
        Route::get('/team/{tenant_id}/tenant', [TeamsController::class, 'findByTenant']);
        Route::post('/teams', [TeamsController::class, 'store']);
        Route::post(
            '/teams/{team}/tenants',
            [TeamsController::class, 'assignTenants']
        );

    });
