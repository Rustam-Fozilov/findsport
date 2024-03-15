<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class Media extends Model
{
    use HasFactory;

    const TYPE_IMAGE = 'image';
    const TYPE_VIDEO = 'video';
    const TYPE_AVATAR = 'avatar';
    const TYPE_THUMBNAIL = 'thumbnail';
    const TYPE_BANNER = 'banner';
    const TYPE_OTHER = 'other';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'model',
        'size',
        'mime_type',
        'url',
        'type',
        'path',
        'mediable_id',
        'mediable_type',
        'medium_size_url',
        'small_size_url'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'path',
        'mediable_id',
        'mediable_type',
        'model'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'size' => 'int'
    ];

    /**
     * Get the owning mediable model.
     */
    public function mediable()
    {
        return $this->morphTo();
    }

    public function setMediableTypeAttribute($value)
    {
        $this->attributes['mediable_type'] = 'App\Models\\' . Str::of($value)->singular()->ucfirst();
        $this->attributes['model'] = $value;
    }

    public function getOriginalUrlAttribute()
    {
        return str_replace(config('global.disks.s3.url'), '', $this->url);
    }

    public function getMediumUrlAttribute()
    {
        return str_replace(config('global.disks.s3.url'), '', $this->medium_size_url);
    }

    public function getSmallUrlAttribute()
    {
        return str_replace(config('global.disks.s3.url'), '', $this->small_size_url);
    }

    public static function uploadFile(UploadedFile $file, $model)
    {
        return $file->storeAs("public/$model", time() . '_'
            . str_replace(' ', '_', $file->getClientOriginalName()));
    }
}
