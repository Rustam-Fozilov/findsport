<?php

namespace App\Repositories\Advertisement;

use App\Models\Advertisement;
use App\Repositories\BaseRepository;

class AdvertisementRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [

    ];

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Advertisement::class;
    }
}
