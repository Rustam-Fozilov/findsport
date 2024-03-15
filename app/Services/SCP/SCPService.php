<?php

namespace App\Services\SCP;

/*
 * All Section,Clubs,Grounds
 */

use App\Models\Advertisement;
use App\Models\Club;
use App\Models\Ground;
use App\Models\SectionItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

class SCPService
{
    public $limit;
    public $listBy;
    public $active;
    public $latitude;
    public $longitude;
    public $getFavourites;
    public $type;
    public $options;
    public $sports;
    public $roof_type;
    public $district;
    public $inventory;
    public $coating;
    public $time_from;
    public $time_to;
    public $age_from;
    public $age_to;
    public $skill_level;
    public $price_from;
    public $price_to;

    public function __construct()
    {
        $this->limit = null;
        $this->listBy = 'latest';
        $this->search_query = null;
        $this->active = null;
        $this->latitude = null;
        $this->longitude = null;
        $this->getFavourites = null;
        $this->type = null;
        $this->options = null;
        $this->sports = null;
        $this->roof_type = null;
        $this->district = null;
        $this->inventory = null;
        $this->coating = null;
        $this->time_from = null;
        $this->time_to = null;
        $this->age_from = null;
        $this->age_to = null;
        $this->skill_level = null;
        $this->price_from = null;
        $this->price_to = null;
    }

    public function setRequest($request)
    {
        $this->limit = $request->query('limit');
        $this->listBy = $request->query('listBy') ?: 'latest';
        $this->search_query = $request->query('search_query');
        $this->active = true;
        $this->latitude = $request->query('latitude');
        $this->longitude = $request->query('longitude');
        $this->getFavourites = $request->query('is_favourite');
        $this->type = $request->query('type');
        $this->options = $request->query('options');
        $this->sports = $request->query('sports');
        $this->roof_type = $request->query('roof_type');
        $this->district = $request->query('district');
        $this->inventory = $request->query('inventory');
        $this->coating = $request->query('coating');
        $this->time_from = $request->query('time_from');
        $this->time_to = $request->query('time_to');
        $this->age_from = $request->query('age_from');
        $this->age_to = $request->query('age_to');
        $this->skill_level = $request->query('skill');
        $this->price_from = $request->query('price_from');
        $this->price_to = $request->query('price_to');
    }

    public function grounds($limit)
    {
        return Ground::query()
            ->when($this->search_query, function ($query) {
                return $query->where('title', 'like', "%{$this->search_query}%")
                    ->orWhere('description', 'like', "%{$this->search_query}%");
            })
            ->when($this->active, function ($query) {
                return $query->where('active', $this->active);
            })
            ->when($this->district, function ($query) {
                return $query->where('district_id', $this->district);
            })
            ->when($this->sports, function ($query) {
                return $query->whereHas('sports', function ($query) {
                    return $query->whereIn('id', $this->sports);
                });
            })
            ->when($this->options, function ($query) {
                return $query->where(function ($query) {
                    foreach ($this->options as $option) {
                        $query->where('options', '@>', '{"' . $option . '":true}');
                    }
                });
            })
            ->when($this->roof_type, function ($query) {
                return $query->where('type_id', $this->roof_type);
            })
            ->when($this->inventory, function ($query) {
                return $query->whereHas('inventory', function ($query) {
                    $query->whereIn('id', $this->inventory);
                });
            })
            ->when($this->coating, function ($query) {
                return $query->whereHas('coatings', function ($query) {
                    $query->whereIn('id', $this->coating);
                });
            })
            ->when($this->price_from, function ($query) {
                return $query->where('price', '>=', $this->price_from);
            })
            ->when($this->price_to, function ($query) {
                return $query->where('price', '<=', $this->price_to);
            })
            ->listBy($this->listBy)
            //->closest($latitude, $longitude)
            ->favourites($this->getFavourites, optional(request()->user('sanctum'))->id)
            ->pagination($limit);

    }


    public function getPhone($id)
    {
        $ground = Advertisement::query()->findOrFail($id);
        $ground->increment('phone_views');
        return $ground->phone;

    }

}
