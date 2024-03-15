<?php

namespace App\Resources\API\v1;


use App\Models\Trainer;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class TrainerResource extends JsonResource
{


    public function toArray($request): array
    {
        /**
         * @var Trainer $this
         */
        return [
            'id' => $this->id,
            'name' => $this->name,
            'short_text' => $this->short_text,
            'description' => $this->description_uz,
            'image' => $this?->image?->url ?? '/images/sample_293x210.jpg',
        ];
    }
}
