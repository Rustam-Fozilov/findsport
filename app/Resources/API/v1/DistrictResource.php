<?php

namespace App\Resources\API\v1;

use App\Models\District;
use App\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DistrictResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        /**
         * @var District $this
         */
        return [
            'id' => $this->id,
            'title' => $this->name_uz,
            ];
    }
}
