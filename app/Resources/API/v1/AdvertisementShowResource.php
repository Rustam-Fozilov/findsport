<?php

namespace App\Resources\API\v1;


use App\Models\Advertisement;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class AdvertisementShowResource extends JsonResource
{

    public bool $preserveKeys = true;

    public function toArray($request): array
    {
        /**
         * @var Advertisement $this
         */

        $advertisement = [
            'id' => $this->id,
            'title' => $this->title_uz,
            'ad_type' => $this->ad_type,
            'description' => $this->description_uz,
            'sport' => SportResource::collection($this->sports),
            'rating' => $this->rate ?? 3,
            'image' => $this?->thumbnail?->url ?? '/images/sample_293x210.jpg',
            'price' => $this->price,
            'location' => $this->location,
            'landmark' => $this->landmark ?? '',
            'is_favorite' => $this->is_favorite,
            'phones'=>$this->phones,
            'infrastructure'=>InfrastructureResource::collection($this->infrastructure)
        ];
        switch ($this->ad_type) {
            case 'ground':
                $advertisement = array_merge($advertisement, [
                        'ground_size' => $this->items?->ground_size ?? '',
                        'season' => $this->items?->season ?? 0,
                    ]
                );
                break;
            case 'section':
                $advertisement = array_merge($advertisement, [
                        'ground_size' => $this->items?->ground_size ?? '',
                        'season' => $this->items?->season ?? 0,
                        "age_begin" => $this->items?->age_begin ?? 7,
                        "age_end" => $this->items?->age_end ?? 50,
                        "degree" => new DegreeResource($this->items?->degree ),
                        "trainers" => TrainerResource::collection($this->trainers)
                    ]
                );
                break;
        }
        return $advertisement;
    }
}
