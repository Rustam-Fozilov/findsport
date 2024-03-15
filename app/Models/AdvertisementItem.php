<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdvertisementItem extends Model
{
    use HasFactory;
    protected $fillable=[
        'advertisement_id',
        'sport_id',
        'degree_id',
        'ground_size',
        'ground_season_type',
        'age_begin',
        'age_end',
        'steps',
        'items',
        'price'
    ];

    public function degree()
    {
        return $this->hasOne(Degree::class,'id','degree_id');
    }
    public function getSeasonAttribute()
    {
        return match ($this->ground_season_type){
            0=>[
                'title_uz'=>'☀️ Yozgi',
                'title_ru'=>'☀️ Летний',
                'title_en'=>'☀️ Summer'
            ],
            1=>[
                'title_uz'=>'❄️ Qishki',
                'title_ru'=>'❄️ Зимний',
                'title_en'=>'❄️ Winter'
            ],
           2=>[
               'title_uz'=>'🌤️ Mavsumiy',
               'title_ru'=>'🌤️ Всесезонный',
               'title_en'=>'🌤️ All-season'
           ],
        };
    }
}
