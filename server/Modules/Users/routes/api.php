<?php

use Illuminate\Support\Facades\Route;
use Modules\Users\Http\Controllers\UsersController;

// test

Route::get('/v1/users', [UsersController::class, 'index']);