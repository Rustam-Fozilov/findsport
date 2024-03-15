<?php

namespace App\Resources\API\v1;


use App\Models\SearchHistory;
use Illuminate\Http\Resources\Json\JsonResource;

class SearchResource extends JsonResource
{


    public function toArray($request): array
    {
        /**
         * @var SearchHistory $this
         */
        return [
            'keyword' => $this->search_keyword,
        ];
    }
}
