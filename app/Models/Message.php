<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Message extends Model
{
    use HasFactory;

    protected $table = 'messages';

    protected $guarded = ['id'];

    public function messageable(): MorphTo
    {
        return $this->morphTo();
    }

    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class);
    }
}
