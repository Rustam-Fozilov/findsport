<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    use HasFactory;
    protected $fillable=[
        'name_uz',
        'name_oz',
        'name_ru',
        'region_id'
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }
}
