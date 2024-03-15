<?php

namespace App\Resources\API\v1;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
         * @var User $this
         */
        return [
            "id" => $this->id,
            "first_name" => $this->first_name,
            "last_name" => $this->last_name ,
            "phone" => $this->phone,
            "birthday" => $this->birthday ? $this->birthday->format('d.m.Y') : null,
//            "age" => $this->age ?? null,
            "gender" => $this->gender ?? null,
            "avatar" => $this->avatar->image_url ?? '/images/sample_293x210.jpg',
            "status" => $this->status ?? null,
            "email" => $this->email ?? null,
//            'district' => $this->district_id ? new DistrictParentResource($this->district) : null,
        ];
    }
}
