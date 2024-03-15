<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ChatUser extends Model
{
    use HasFactory;

    protected $fillable = ['chat_id', 'user_id'];

    protected $table = 'chat_user';

    public function chats(): BelongsToMany
    {
        return $this->belongsToMany(Chat::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
