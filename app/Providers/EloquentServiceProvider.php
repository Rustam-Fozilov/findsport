<?php

namespace App\Providers;

use App\Models\Club;
use App\Models\Ground;
use App\Models\SectionItem;
use App\Observers\Banner\ClubObserver;
use App\Observers\Banner\GroundObserver;
use App\Observers\Banner\SectionItemObserver;
use App\Observers\Brand\BrandObserver;

class EloquentServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        Ground::observe(GroundObserver::class);
        Club::observe(ClubObserver::class);
        SectionItem::observe(SectionItemObserver::class);

    }
}
