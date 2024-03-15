<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    protected $table = 'chats';

    public function messages(): MorphMany
    {
        return $this->morphMany(Message::class, 'messageable');
    }
}
