<?php

use App\Http\Controllers\API\{AdvertisementController, FavoriteController, InfoController, NotificationController};
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\UploaderController;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/api_auth.php';


Route::get('home', [InfoController::class, 'index'])->name('api.home');
Route::get('phone-view', [InfoController::class, 'phoneView'])->name('api.phone-view');

Route::middleware(['auth:sanctum', 'auth'])->group(function () {
    Route::post('/upload', [UploaderController::class, 'upload'])->name('file-upload-posts');
    Route::delete('/upload-delete', [UploaderController::class, 'delete'])->name('file-delete-posts');

    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'notifications'])->name('api.messages.notifications');
        Route::post('/mark-as-read', [NotificationController::class, 'markAsRead'])->name('api.messages.mark_as_read');
    });
});

Route::prefix('advertisements')->group(function () {
    Route::get('/home', [AdvertisementController::class, 'index'])->name('api.advertisements.index');
    Route::get('/best-ads', [AdvertisementController::class, 'best_ads'])->name('api.advertisements.best_ads');
    Route::get('/all-ads', [AdvertisementController::class, 'all'])->name('api.advertisements.all+ads');
    Route::get('/grounds', [AdvertisementController::class, 'grounds'])->name('api.advertisements.grounds');
    Route::get('/sections', [AdvertisementController::class, 'sections'])->name('api.advertisements.sections');
    Route::get('/clubs', [AdvertisementController::class, 'clubs'])->name('api.advertisements.clubs');
    Route::get('/locations', [AdvertisementController::class, 'locations'])->name('api.locations');
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::get('/my', [AdvertisementController::class, 'getMyAds'])->name('api.advertisements.my_ads');
        Route::get('/my-clubs', [AdvertisementController::class, 'getMyClubs'])->name('api.advertisements.my_clubs');
        Route::post('/create', [AdvertisementController::class, 'store'])->name('api.advertisements.store');
        Route::put('/{advertisement}', [AdvertisementController::class, 'update'])->name('api.advertisements.update');
        Route::delete('/{advertisement}', [AdvertisementController::class, 'destroy'])->name('api.advertisements.destroy');
        Route::get('/like', [AdvertisementController::class, 'like_ads'])->name('api.favorites.index');
        Route::post('/like', [FavoriteController::class, 'store'])->name('api.favorites.store');
        Route::delete('/like', [FavoriteController::class, 'delete'])->name('api.favorites.delete');

    });
    Route::get('{advertisement}', [AdvertisementController::class, 'show'])->name('api.advertisements.show');
});

Route::prefix('messages')->group(function () {
    Route::get('/', [MessageController::class, 'index'])->name('api.messages.index');
    Route::post('/send-admin', [MessageController::class, 'sendToAdmin'])->name('api.messages.store');
    Route::post('/send-client', [MessageController::class, 'sendToClient'])->name('api.messages.store_client');
});

Route::get('search', [AdvertisementController::class, 'search'])->name('api.search.advertisements');
Route::get('search-history', [AdvertisementController::class, 'searchHistory'])
    ->name('api.search.history')
    ->middleware('auth:sanctum');
Route::get('sports', [InfoController::class, 'sports'])->name('api.sports.list');
Route::get('infrastructure', [InfoController::class, 'infrastructures'])->name('api.infrastructures.list');
Route::get('regions', [InfoController::class, 'regions'])->name('api.regions');
Route::get('districts', [InfoController::class, 'districts'])->name('api.districts');
Route::get('site', [InfoController::class, 'info'])->name('api.info');
