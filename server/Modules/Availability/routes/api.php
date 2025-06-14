<?php

use Illuminate\Support\Facades\Route;
use Modules\Availability\Http\Controllers\AvailabilityController;


Route::middleware(['auth:sanctum', \Spatie\Multitenancy\Http\Middleware\NeedsTenant::class])
    ->prefix('v1')
    ->group(function () {
        Route::post('/teams/{id}/availability', [AvailabilityController::class, 'setAvailability']);
        Route::get('/teams/{id}/generate-slots', [AvailabilityController::class, 'generateSlots']);
    });