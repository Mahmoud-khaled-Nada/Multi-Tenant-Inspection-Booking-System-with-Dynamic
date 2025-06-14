<?php

use Illuminate\Support\Facades\Route;
use Modules\Bookings\Http\Controllers\BookingsController;

Route::middleware(['auth:sanctum', \Spatie\Multitenancy\Http\Middleware\NeedsTenant::class])
    ->prefix('v1')
    ->group(function () {
        Route::get('/bookings', [BookingsController::class, 'index']);
        Route::post('/bookings', [BookingsController::class, 'store']);
        Route::delete('/bookings/{id}', [BookingsController::class, 'destroy']);
    });