<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'favorite_id',
        'favorite_type'
    ];

    public function advertisement():HasOne
    {
        return $this->hasOne(Advertisement::class, 'id', 'favorite_id')->where('favorite_type','advertisement');
    }



}
