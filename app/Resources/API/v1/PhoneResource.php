<?php

namespace App\Resources\API\v1;


use Illuminate\Http\Resources\Json\JsonResource;

class PhoneResource extends JsonResource
{


    public function toArray($request): array
    {

        return [
            'id' => $this->id,
            'title_uz' => $this->title_uz,
            'title_ru' => $this->title_ru,
            'title_en' => $this->title_en,
            'active'=>$this->active
        ];
    }
}
