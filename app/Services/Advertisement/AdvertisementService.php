<?php

namespace App\Services\Advertisement;

use App\Models\Advertisement;
use App\Models\Media;
use App\Models\SearchHistory;
use App\Services\Media\MediaService;
use Illuminate\Support\Facades\DB;
use Stichoza\GoogleTranslate\GoogleTranslate;

class AdvertisementService
{
    public function __construct(MediaService $service)
    {
        $this->service = $service;
    }

    public function all(
        $limit = 5,
        $listBy = 'latest',
        $search_query = null,
        $active = 'pending',
        $latitude = null,
        $longitude = null,
        $getFavourites = null,
        $plan = null,
        $price_from = null,
        $price_to = null,
        $season_type = null,
        $sport_id = null,
        $infrastructure_id = null,
        $steps = null,
        $age_begin = null,
        $age_end = null,
        $ad_type = null,
    )
    {
        return Advertisement::query()
            ->when($search_query, function ($query) use ($search_query) {
                return $query->where('title_uz', 'like', '%' . $search_query . '%')
                    ->orWhere('title_ru', 'like', '%' . $search_query . '%')
                    ->orWhere('title_en', 'like', '%' . $search_query . '%')
                    ->orWhere('description_uz', 'like', '%' . $search_query . '%')
                    ->orWhere('description_ru', 'like', '%' . $search_query . '%')
                    ->orWhere('description_en', 'like', '%' . $search_query . '%');
            })
            ->when($active, function ($query) use ($active) {
                return $query->where('status', $active);
            })
            ->when($plan, function ($query) use ($plan) {
                return $query->where('plan_id', $plan);
            })
            ->when($ad_type, function ($query) use ($ad_type) {
                return $query->where('ad_type', $ad_type);
            })
            ->when($price_from, function ($query) use ($price_from) {
                return $query->where('price', '>', $price_from);
            })
            ->when($price_to, function ($query) use ($price_to) {
                return $query->where('price', '<', $price_to);
            })
            ->when($season_type !== null, function ($query) use ($season_type) {
                return $query->whereRelation('ad_items', 'ground_season_type', '=', $season_type);
            })
            ->when($sport_id, function ($query) use ($sport_id) {
                return $query->whereHas('sports', function ($query) use ($sport_id) {
                    return $query->where('sport_id', '=', $sport_id);
                });
            })
            ->when($infrastructure_id, function ($query) use ($infrastructure_id) {
                return $query->whereHas('infrastructure', function ($query) use ($infrastructure_id) {
                    return $query->whereIn('id', $infrastructure_id);
                });
            })
            ->when($age_begin, function ($query) use ($age_begin) {
                return $query->whereRelation('ad_items', 'age_begin', '>', $age_begin);
            })
            ->when($age_end, function ($query) use ($age_end) {
                return $query->whereRelation('ad_items', 'age_end', '<', $age_end);
            })
            ->with('sports', 'ad_items')
            ->listBy($listBy)
            //->closest($latitude, $longitude)
            ->favourites($getFavourites, optional(request()->user('sanctum'))->id)
            ->pagination((int)$limit);

    }

    public function my(
        $limit = 5,
        $listBy = 'latest',
        $search_query = null,
        $active = 'pending',
        $latitude = null,
        $longitude = null,
        $getFavourites = null,
        $plan = null,
        $ad_type = null,
        $price_from = null,
        $price_to = null,
    )
    {
        return Advertisement::query()
            ->where('user_id', '=', auth()->user()->id)
            ->when($search_query, function ($query) use ($search_query) {
                return $query->where('title_uz', 'like', '%' . $search_query . '%')
                    ->orWhere('title_ru', 'like', '%' . $search_query . '%')
                    ->orWhere('title_en', 'like', '%' . $search_query . '%')
                    ->orWhere('description_uz', 'like', '%' . $search_query . '%')
                    ->orWhere('description_ru', 'like', '%' . $search_query . '%')
                    ->orWhere('description_en', 'like', '%' . $search_query . '%');
            })
            ->when($active, function ($query) use ($active) {
                return $query->where('status', $active);
            })
            ->when($plan, function ($query) use ($plan) {
                return $query->where('plan_id', $plan);
            })
            ->when($ad_type, function ($query) use ($ad_type) {
                return $query->where('ad_type', $ad_type);
            })
            ->when($price_from, function ($query) use ($price_from) {
                return $query->where('price', '>', $price_from);
            })
            ->when($price_to, function ($query) use ($price_to) {
                return $query->where('price', '<', $price_to);
            })
            ->with('sports', 'ad_items')
            ->listBy($listBy)
            //->closest($latitude, $longitude)
            ->favourites($getFavourites, optional(request()->user('sanctum'))->id)
            ->pagination((int)$limit);

    }

    public function locations($listBy = 'latest')
    {
        return Advertisement::query()
            ->with('sports', 'ad_items')
            ->listBy($listBy)
            ->get()
            ->pluck('location');
    }

    public function create(array $attributes)
    {
        $attributes = $this->translate_check($attributes, 'title');
        $attributes = $this->translate_check($attributes, 'description');
        $advertisement = auth()->user()->advertisements()->create(array_intersect_key(
            $attributes,  // the array with all keys
            array_flip([
                'title_uz',
                'title_ru',
                'title_en',
                'description_uz',
                'description_ru',
                'description_en',
                'ad_type',
                'plan_id',
                'location',
                'landmark',
                'district_id',
                'price'
            ]) // keys to be extracted
        ));
//        $advertisement=Advertisement::query()->first();
        $advertisement->sports()->sync($attributes['sports']);
        $this->insertPhone($attributes, $advertisement);
        $this->insertMedia($attributes, $advertisement);

        switch ($attributes['ad_type']) {
            case 'ground':
                $this->insertGround($attributes, $advertisement);
                break;
            case 'section':
                $this->insertSection($attributes, $advertisement);
                break;
        }
        return $advertisement;
    }

    public function insertGround(array $attributes, Advertisement $advertisement): void
    {
        $advertisement->infrastructure()->sync($attributes['infrastructure']);
        $advertisement->ad_items()->updateOrCreate(["advertisement_id" => $advertisement->id], [
            "ground_size" => $attributes['area'],
            "ground_season_type" => $attributes['season'],
        ]);
    }

    public function insertSection(array $attributes, Advertisement $advertisement): void
    {
        $advertisement->infrastructure()->sync($attributes['infrastructure']);
        $advertisement->ad_items()->updateOrCreate(["advertisement_id" => $advertisement->id], [
            "ground_size" => $attributes['area'],
            "ground_season_type" => $attributes['season'],
            "age_begin" => $attributes['age_begin'],
            "age_end" => $attributes['age_end'],
            "degree_id" => $attributes['degree'],
        ]);
        $sum_price = 0;
        foreach ($attributes['prices'] as &$item) {
            $item = array_merge(['advertisement_id' => $advertisement->id], $item);
            $item = array_merge($item, [
                'price_id' => 1,
                'status' => 'active',
                'updated_at' => now(),
            ]);
            $sum_price += $item['price'];
            $item['name'] = $item ['description'];
            unset($item ['description']);
        }
        $attributes['prices'] = array_map("unserialize", array_unique(array_map("serialize", $attributes['prices'])));
        foreach ($attributes['prices'] as $price)
            DB::table('advertisement_price')->updateOrInsert(
                array_slice($price, 0, 2),
                array_slice($price, 2),
            );
        if (!empty($attributes['prices']))
            $advertisement->update(['price' => $sum_price]);

        //Add trainer
        $advertisement->trainers()->updateOrCreate(["advertisement_id" => $advertisement->id],
            [
                "name" => $attributes['trainer']['name'],
                "short_text" => $attributes['trainer']['description'],
            ]
        );
    }

    public function insertPhone(array $attributes, Advertisement $advertisement): void
    {
        if (!empty($attributes['phones'])) {
            foreach ($attributes['phones'] as &$item) {
                $item = array_merge(['advertisement_id' => $advertisement->id], $item);
            }
            $attributes['phones'] = array_map("unserialize", array_unique(array_map("serialize", $attributes['phones'])));
            foreach ($attributes['phones'] as $phone)
                DB::table('advertisement_phone')->updateOrInsert(
                    array_slice($phone, 0, 2),
                    array_slice($phone, 2)

                );
        }
        if (!empty($attributes['phone'])) {
            DB::table('advertisement_phone')->updateOrInsert(
                [
                    "advertisement_id" => $advertisement->id,
                    "name" => auth()->user()?->first_name,
                ], ["phone" => $attributes['phone']]
            );
        }
    }

    public function insertMedia(array $attributes, Advertisement $advertisement): void
    {
        if (!empty($attributes['medias'])) {
            foreach ($attributes['medias'] as $media) {
                $user_obj = auth()->user();
                $filePath = "public/uploads/temp/{$user_obj?->id}/";
                $finalPath = storage_path("app/" . $filePath);
                if (file_exists($finalPath . $media)) {
                    $this->service->create(['media' => $finalPath . $media], 'advertisements', $advertisement->id);
                } elseif (file_exists($media)) {
                    $this->service->create(['media' => $media], 'advertisements', $advertisement->id);
                }
            }
        }
    }

    public function update(array $attributes, Advertisement $advertisement)
    {
        $attributes = $this->translate_check($attributes, 'title');
        $attributes = $this->translate_check($attributes, 'description');
        $advertisement->update(array_intersect_key(
            $attributes,  // the array with all keys
            array_flip(['title_uz',
                'title_ru',
                'title_en',
                'description_uz',
                'description_ru',
                'description_en',
                'ad_type',
                'plan_id',
                'location',
                'landmark',
                'district_id',
                'price']) // keys to be extracted
        ));
        $this->insertPhone($attributes, $advertisement);
        switch ($attributes['ad_type']) {
            case 'ground':
                $this->insertGround($attributes, $advertisement);
                break;
            case 'section':
                $this->insertSection($attributes, $advertisement);
                break;
        }
        return $advertisement;
    }

    public function delete(Advertisement $advertisement)
    {
        $advertisement->delete();
        return $advertisement;
    }

    public function translate_check(array $attributes, $key): array
    {
        if (!empty($attributes[$key])) {
            $tr = new GoogleTranslate();
            $tr->translate($attributes[$key]);
            $detect = $tr->getLastDetectedSource();
            switch ($detect) {
                case 'uz':
                    $attributes[$key . '_uz'] = $attributes[$key];
                    $tr->setTarget('ru');
                    $attributes[$key . '_ru'] = $tr->translate($attributes[$key]);
                    $tr->setTarget('en');
                    $attributes[$key . '_en'] = $tr->translate($attributes[$key]);
                    break;
                case 'ru':
                    $attributes[$key . '_ru'] = $attributes[$key];
                    $tr->setTarget('uz');
                    $attributes[$key . '_uz'] = $tr->translate($attributes[$key]);
                    $tr->setTarget('en');
                    $attributes[$key . '_en'] = $tr->translate($attributes[$key]);
                    break;
                case 'en':
                    $attributes[$key . '_en'] = $attributes[$key];
                    $tr->setTarget('uz');
                    $attributes[$key . '_uz'] = $tr->translate($attributes[$key]);
                    $tr->setTarget('ru');
                    $attributes[$key . '_ru'] = $tr->translate($attributes[$key]);
                    break;
                default:
                    $tr->setTarget('uz');
                    $attributes[$key . '_uz'] = $tr->translate($attributes[$key]);
                    $tr->setTarget('ru');
                    $attributes[$key . '_ru'] = $tr->translate($attributes[$key]);
                    $tr->setTarget('en');
                    $attributes[$key . '_en'] = $tr->translate($attributes[$key]);
            }
            unset($attributes[$key]);
        }
        return $attributes;
    }

    public function filterArrayByKeys(array $input, array $column_keys)
    {
        $result = array();
        $column_keys = array_flip($column_keys); // getting keys as values
        foreach ($input as $key => $val) {
            // getting only those key value pairs, which matches $column_keys
            $result[$key] = array_intersect_key($val, $column_keys);
        }
        return $result;
    }

    public function searchHistory($user_id)
    {
        return SearchHistory::where('user_id', $user_id)->get();
    }

    public function addHistory($user_id, $keyword)
    {
        return SearchHistory::query()->firstOrCreate([
            'user_id' => $user_id,
            'search_keyword' => $keyword
        ]);
    }
}
