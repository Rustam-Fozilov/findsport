<?php

namespace App\Http\Controllers;

use App\Models\Coating;
use App\Models\Option;
use App\Models\Page;
use App\Models\Region;
use App\Models\Site;
use App\Models\Sport;
use App\Models\Type;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class FrontController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public $regions;
    public $sports;
    public $types;
    public $coatings;
    public $options;
public $pages;
public $site;
    public function __construct()
    {
        $header=[];
        foreach (['ground', 'section', 'club', 'event'] as $item) {
            if (strpos(request()?->route()?->getName(), $item) !== false)
                $header[$item]= 'header-nav__link_active';
        }

        $front_page = Cache::get('front_page');
        if (!Cache::has('front_page')) {
            $this->regions = Region::query()->get();
            $this->types = Type::query()->active()->get();
            $this->sports = Sport::query()->active()->get()->load('image');
            $this->options = Option::query()->active()->get();
            $this->coatings = Coating::query()->active()->get();
            $this->pages= Page::all();
            $this->site=Site::first();
            Cache::put('front_page',
                [
                    'regions' => $this->regions,
                    'types' => $this->types,
                    'sports' => $this->sports,
                    'options' => $this->options,
                    'coatings' => $this->coatings,
                    'site' => $this->site,
                    'pages' => $this->pages,
                ]
                , 60 * 60);
        } else {
            $this->regions = $front_page['regions'];
            $this->types = $front_page['types'];
            $this->sports = $front_page['sports'];
            $this->options = $front_page['options'];
            $this->coatings = $front_page['coatings'];
            $this->site = $front_page['site'];
            $this->pages = $front_page['pages'];
        }

        view()->share('regions', $this->regions);
        view()->share('site', $this->site);
        view()->share('pages', $this->pages);
        view()->share('header', $header);
        view()->share('types', $this->types);
        view()->share('sports', $this->sports);
        view()->share('options', $this->options);
        view()->share('coatings', $this->coatings);
    }
}
