<?php


use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\IndexController;
use App\Http\Controllers\Admin\Infrastructures\InfrastructureController;
use App\Http\Controllers\Admin\Advertisement\AdvertisementController;
use App\Http\Controllers\Admin\Sports\SportController;
use Illuminate\Support\Facades\Route;

Route::get('/lang/{locale}', function ($locale) {
    session(['lang' => $locale]);
    return redirect()->back();
})->where(['locale' => 'ru|uz']);
Route::get('/region/{id}', function ($id) {
    session(['region' => $id]);
    return redirect()->back();
})->where(['region' => '[0-9]+']);

Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'sign'])->name('signin');
Route::middleware('check-role', 'auth')->group(function () {
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/', [IndexController::class, 'index'])->name('admin.dashboard');
    Route::get('/users/show/{id}', [IndexController::class, 'index'])->name('admin.users.show');
    Route::get('/users/edit/{id}', [IndexController::class, 'index'])->name('admin.users.edit');
    Route::get('/lock/{id}', [IndexController::class, 'index'])->name('lockscreen');

    Route::resource('/users', IndexController::class);

    Route::get('advertisements', [AdvertisementController::class, 'index'])->name('advertisements.index');
    Route::post('advertisements', [AdvertisementController::class, 'store'])->name('advertisements.store');
    Route::get('advertisements/create', [AdvertisementController::class, 'create'])->name('advertisements.create');
    Route::put('advertisements/{advertisements}', [AdvertisementController::class, 'update'])->name('advertisements.update');
    Route::get('advertisements/{id}/delete', [AdvertisementController::class, 'getDelete'])->name('advertisements.delete');
    Route::get('advertisements/{id}/confirm-delete', [AdvertisementController::class, 'getModalDelete'])->name('advertisements.confirm-delete');
    Route::get('advertisements/{advertisements}', [AdvertisementController::class, 'show'])->name('advertisements.show');
    Route::get('advertisements/{advertisements}/edit', [AdvertisementController::class, 'edit'])->name('advertisements.edit');


    Route::get('sports', [SportController::class, 'index'])->name('sports.index');
    Route::post('sports', [SportController::class, 'store'])->name('sports.store');
    Route::get('sports/create', [SportController::class, 'create'])->name('sports.create');
    Route::put('sports/{sports}', [SportController::class, 'update'])->name('sports.update');
    Route::get('sports/{id}/delete', [SportController::class, 'getDelete'])->name('sports.delete');
    Route::get('sports/{id}/confirm-delete', [SportController::class, 'getModalDelete'])->name('sports.confirm-delete');
    Route::get('sports/{sports}', [SportController::class, 'show'])->name('sports.show');
    Route::get('sports/{sports}/edit', [SportController::class, 'edit'])->name('sports.edit');


    Route::get('infrastructures', [InfrastructureController::class, 'index'])->name('infrastructures.index');
    Route::post('infrastructures', [InfrastructureController::class, 'store'])->name('infrastructures.store');
    Route::get('infrastructures/create', [InfrastructureController::class, 'create'])->name('infrastructures.create');
    Route::put('infrastructures/{infrastructures}', [InfrastructureController::class, 'update'])->name('infrastructures.update');
    Route::get('infrastructures/{id}/delete', [InfrastructureController::class, 'getDelete'])->name('infrastructures.delete');
    Route::get('infrastructures/{id}/confirm-delete', [InfrastructureController::class, 'getModalDelete'])->name('infrastructures.confirm-delete');
    Route::get('infrastructures/{infrastructures}', [InfrastructureController::class, 'show'])->name('infrastructures.show');
    Route::get('infrastructures/{infrastructures}/edit', [InfrastructureController::class, 'edit'])->name('infrastructures.edit');

});


