<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'birthday',
        'login',
        'phone',
        'password',
        'gender',
        'status',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'login',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'status' => 'boolean',
        'birthday' => 'datetime:Y-m-d',
    ];
    public function getFullNameAttribute(): string
    {
        return $this->first_name . " " . $this->last_name;
    }
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }
    public function admin()
    {
        return $this->role_id === 1;
    }

    public function messages(): MorphMany
    {
        return $this->morphMany(Message::class, 'messageable');
    }

    public function advertisements(): HasMany
    {
        return $this->hasMany(Advertisement::class);
    }

    public function scopeRoleId($query, $role_id)
    {
        if (!$role_id)
            return $query->whereNull('role_id');
        return $query;
    }
    public function avatar()
    {
        return $this->morphOne(Media::class, 'mediable')
            ->where('type', Media::TYPE_AVATAR);
            //->withDefault(['url' => '/images/sample_293x210.jpg']);
    }
    public function scopeActive($q)
    {
        return $q->where('active', '=', true)->orderBy('position', 'DESC');
    }
//    public function setPasswordAttribute($value): void
//    {
//        $this->attributes['password'] = bcrypt($value);
//    }
}
