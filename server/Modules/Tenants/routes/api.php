<?php

use Illuminate\Support\Facades\Route;
use Modules\Tenants\Http\Controllers\TenantsController;



Route::middleware(['auth:sanctum', \Spatie\Multitenancy\Http\Middleware\NeedsTenant::class])
    ->prefix('v1')
    ->group(function () {
        Route::get('/tenant', [TenantsController::class, 'show']);
    });