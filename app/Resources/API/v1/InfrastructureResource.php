<?php

namespace App\Resources\API\v1;


use App\Models\Infrastructure;
use Illuminate\Http\Resources\Json\JsonResource;

class InfrastructureResource extends JsonResource
{


    public function toArray($request): array
    {
        /**
         * @var Infrastructure $this
         */
        return [
            'id' => $this->id,
            'title' => $this->title_uz,
            'active'=>$this->active
        ];
    }
}
