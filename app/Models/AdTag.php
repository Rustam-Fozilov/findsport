<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdTag extends Model
{
    use HasFactory;
    protected $fillable=[
        'active',
        'position',
        'title_en',
        'title_ru',
        'title_uz',
    ];
}
