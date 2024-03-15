<?php

namespace App\Resources\API\v1;


use App\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegionResource extends JsonResource
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
         * @var Region $this
         */

        return [
            'id' => $this->id,
            'title'=>$this->name_uz,
            'districts_count' => $this->districts->count(),
        ];
    }
}
