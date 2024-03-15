<?php

namespace App\Models;

use App\Casts\TranslatableJson;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    protected $fillable=[
        'name_uz',
        'name_oz',
        'name_ru',
        'position',
    ];

    public function districts()
    {
        return $this->hasMany(District::class);
    }

}
