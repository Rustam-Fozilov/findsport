<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rates extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_id',
        'user_id',
        'body',
        'model',
        'rating',
        'option',
        'personal',
        'coating'
    ];

}
