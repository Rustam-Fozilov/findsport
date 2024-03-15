<?php

namespace App\Repositories\Sports;

use App\Models\Sport;
use App\Repositories\BaseRepository;

class SportRepository extends BaseRepository
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
        return Sport::class;
    }
}
