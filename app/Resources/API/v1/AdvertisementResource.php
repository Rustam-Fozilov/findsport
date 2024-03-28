<?php

namespace App\Resources\API\v1;


use App\Resources\API\v1\SportResource;
use App\Models\Advertisement;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class AdvertisementResource extends JsonResource
{

    public bool $preserveKeys = true;

    public function toArray($request): array
    {
        /**
         * @var Advertisement $this
         */
        return [
            'id' => $this->id,
            'title' => $this->title_uz,
            'ad_type' => $this->ad_type,
            'description' =>Str::limit($this->description_uz, 100),
            'sport' => new SportResource($this->whenLoaded('sports')?->first()),
            'season' => $this->whenLoaded('ad_items')?->season,
            'rating' => $this->rate ?? 3,
            'image'=>$this?->thumbnail?->url ?? '/images/sample_293x210.jpg',
            'price'=>$this->price,
            'location'=>$this->location,
            'landmark' => $this->landmark,
            'is_favorite'=>$this->is_favorite,
            'status' => $this->status,
            'images' => $this->images,
        ];
    }
}
