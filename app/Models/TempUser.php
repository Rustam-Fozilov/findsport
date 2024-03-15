<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class TempUser extends Model
{
    use HasFactory;

    protected $table = 'temp_users';

    protected $fillable = ['uid'];

    public function messages(): MorphMany
    {
        return $this->morphMany(Message::class, 'messageable');
    }
}
