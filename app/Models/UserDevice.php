<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
/**
 * Class UserDevice
 * @package App\Models
 * @property string id
 * @property string push_token
 * @property string device_uid
 * @property string client_id
 * @property User client
 */
class UserDevice extends Model
{
    use HasFactory;
    protected $fillable = [
        'push_token',
        'device_uid',
        'user_id'
    ];

    /**
     * @return BelongsTo|User
     */
    public function user(): BelongsTo|User
    {
        return $this->belongsTo(User::class);
    }
}
