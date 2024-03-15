<?php

namespace App\Repositories\Infrastructures;

use App\Models\Infrastructure;
use App\Repositories\BaseRepository;

class InfrastructureRepository extends BaseRepository
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
        return Infrastructure::class;
    }
}
