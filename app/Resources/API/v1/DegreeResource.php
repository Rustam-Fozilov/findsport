<?php

namespace App\Resources\API\v1;


use App\Models\Degree;
use Illuminate\Http\Resources\Json\JsonResource;

class DegreeResource extends JsonResource
{


    public function toArray($request): array
    {
        /**
         * @var Degree $this
         */
        return [
            'id' => $this->id,
            'title' => $this->title_uz,
            'image' => $this?->image?->url ?? '/images/sample_293x210.jpg',
        ];
    }
}
