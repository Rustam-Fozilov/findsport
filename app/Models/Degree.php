<?php

namespace App\Models;

use App\Casts\TranslatableJson;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Degree extends Model
{
    use HasFactory;

    protected $fillable=[
        'title_uz',
        'title_ru',
        'title_en',
        'active',
        'position',
    ];

    public function scopeActive($q)
    {
        return $q->where('active', '=', true)->orderBy('position', 'DESC');
    }

}
