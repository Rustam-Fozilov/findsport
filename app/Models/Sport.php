<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    use HasFactory;
    protected $fillable=[
        'title_uz',
        'title_ru',
        'title_en',
        'active',
        'position',
    ];

    public function image()
    {
        return $this->morphOne(Media::class, 'mediable')
            ->where('type', Media::TYPE_THUMBNAIL);
//            ->withDefault(['url' => '/images/sample_293x210.jpg']);
    }
    public function scopeActive($q)
    {
        return $q->where('active', '=', true)->orderBy('position', 'DESC');
    }
}
