<?php

namespace App\Repositories\AdTags;

use App\Models\AdTag;
use App\Repositories\BaseRepository;

class AdTagRepository extends BaseRepository
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
        return AdTag::class;
    }
}
