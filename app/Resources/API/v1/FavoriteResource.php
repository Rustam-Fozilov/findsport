<?php

namespace App\Resources\API\v1;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FavoriteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        /**
         * @var Favorite $this
         */
        return [
            "id" => $this->id,
            "count" => Favorite::query()->select('id')->where('product_id',$this->product->id)->count(),
        ];
    }
}
