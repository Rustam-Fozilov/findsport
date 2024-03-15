<?php
;

use App\Http\Controllers\Admin\{};

use App\Http\Controllers\AdminApi\{
    ClubController,
    GroundController,
    SectionController,
    EventController,
    PageController,
    };
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::resource('/grounds', GroundController::class);
Route::resource('/sections', SectionController::class);
Route::resource('/clubs', ClubController::class);
Route::resource('/events', EventController::class);
Route::resource('/pages', PageController::class);
Route::resource('/types', PageController::class);


