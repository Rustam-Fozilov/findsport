<?php

namespace App\Resources\API\v1;


use App\Models\Sport;
use Illuminate\Http\Resources\Json\JsonResource;

class SportResource extends JsonResource
{


    public function toArray($request): array
    {
        /**
         * @var Sport $this
         */
        return [
            'id' => $this->id,
            'title' => $this->title_uz,
            'image' => $this?->image?->url ?? '/images/sample_293x210.jpg',
        ];
    }
}
