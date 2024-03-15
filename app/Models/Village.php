<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    use HasFactory;
    protected $fillable=[
        'name_uz',
        'name_oz',
        'name_ru',
        'district_id' ];
    public function districts()
    {
        return $this->belongsTo(District::class);
    }
}
