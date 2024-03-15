<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['chat_id', 'user_id', 'message', 'read'];

    protected $table = 'messages';

    public function chatUser(): BelongsToMany
    {
        return $this->belongsToMany(ChatUser::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
