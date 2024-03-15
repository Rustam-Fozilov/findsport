<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Trainer extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'short_text',
        'description_uz',
        'description_ru',
        'description_en',
    ];
    public function image(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediable',);
    }
}
