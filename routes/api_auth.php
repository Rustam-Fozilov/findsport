<?php

use App\Http\Controllers\API\{AuthController,
    UserController
};
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::prefix('signup')
    ->group(function () {
        Route::post('/step-1', [AuthController::class, 'Registration']);
        Route::post('/step-2', [AuthController::class, 'authConfirm']);
        Route::post('/step-3', [AuthController::class, 'fillProfile'])->name('fillProfile');
    });
Route::prefix('signin')->group(function () {
    Route::post('/login', [AuthController::class, 'authenticate']);
    Route::post('/step-1', [AuthController::class, 'resendSms']);
    Route::post('/step-2', [AuthController::class, 'authConfirm']);
});
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    Route::get('/profile', [UserController::class, 'me']);
    Route::post('/profile', [UserController::class, 'update']);
    //Route::post('/favorite', [FavoriteController::class, 'store'])->name('front.favorite.add');
});

