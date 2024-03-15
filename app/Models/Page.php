<?php

namespace App\Models;

use App\Casts\TranslatableJson;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'active',
        'position',
    ];
    protected $casts = [
        'name' => TranslatableJson::class,
        'description' => TranslatableJson::class,


    ];
    public function scopeActive($q)
    {
        return $q->where('active', '=', true)->orderBy('position', 'DESC');
    }
}
