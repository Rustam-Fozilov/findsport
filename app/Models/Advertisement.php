<?php

namespace App\Models;

use App\Enums\SeasonEnum;
use App\Enums\StatusEnum;
use App\Rules\PhoneRule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, MorphMany, MorphOne};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;

class Advertisement extends Model
{
    use HasFactory;

    protected $fillable = [
        'ad_id',
        'title_uz',
        'title_ru',
        'title_en',
        'description_uz',
        'description_ru',
        'description_en',
        'ad_type',
        'slug',
        'rate',
        'landmark',
        'location',
        'district_id',
        'price',
        'views',
        'calls',
        'favourites',
        'status',
        'position',
        'begin_date',
        'end_date',
        'source',
        'telegram_post_id'
    ];
    protected $casts = [
        'location' => 'array',
    ];
    public static $rules = [
        'title' => 'required_without_all:title_uz,title_ru,title_en|string|max:255',
        'description' => 'required_without_all:description_uz,description_ru,description_en',
        'title_uz' => 'required_without_all:title,title_ru,title_en|string|max:255',
        'title_ru' => 'required_without_all:title,title_uz,title_en|string|max:255',
        'title_en' => 'required_without_all:title,title_ru,title_uz|string|max:255',
        'description_uz' => 'required_without_all:description,description_ru,description_en',
        'description_ru' => 'required_without_all:description,description_uz,description_en',
        'description_en' => 'required_without_all:description,description_uz,description_ru',
        'price' => 'required|integer',
        'landmark' => 'nullable|string|max:255',
        'location.latitude' => 'nullable|between:-90,90',
        'location.longitude' => 'nullable|between:-180,180',
        'district_id' => 'nullable||exists:districts,id',
        'sports.*' => 'required||exists:sports,id',
        'ad_type' => 'required|in:ground,club,section',
        'status' => 'nullable|in:active,pending,rejected,inactive',
        'position' => 'nullable|integer',
        'begin_date' => 'nullable',
        'end_date' => 'nullable'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($advertisement) {
            $advertisement->ad_id = (string)Str::uuid(36);
        });
    }

    public function getGeoArrayAttribute(): array
    {
        return explode(',', $this->geo_location);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function thumbnail(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediable')
            /*->where('type', Media::TYPE_THUMBNAIL)*/;
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable',);
    }

    public function videos(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable', Media::TYPE_VIDEO,);
    }

    public function infrastructure(): BelongsToMany
    {
        return $this->belongsToMany(Infrastructure::class, 'advertisement_infrastructure');
    }

    public function sports(): BelongsToMany
    {
        return $this->belongsToMany(Sport::class, 'advertisement_sport');
    }

    public function trainers(): BelongsToMany
    {
        return $this->belongsToMany(Trainer::class, 'advertisement_trainer');
    }

    public function ad_items()
    {
        return $this->belongsTo(AdvertisementItem::class, 'id', 'advertisement_id');
    }

    public function getPhonesAttribute(): \Illuminate\Support\Collection
    {
        //Phone class not exists, advertisement_phone table:advertisement_id,name,phone
        $phones = DB::table('advertisement_phone')
            ->where('advertisement_id', $this->id)->select(['name', 'phone'])->get();

        return $phones;
    }

    public function getPricesAttribute(): \Illuminate\Support\Collection
    {
        //Phone class not exists, advertisement_phone table:advertisement_id,name,phone
        $phones = DB::table('advertisement_price')
            ->where('advertisement_id', $this->id)->get(['name as description', 'price']);
        return $phones->pluck(['price', 'description']);
    }


    public function scopeActive($q)
    {
        return $q->where('status', 'active')->orderBy('position', 'DESC');
    }


    public function scopeFavourites($query, $getFavourites, $userId)
    {
        if ($getFavourites && $userId) {
            $favorite = Favorite::where('user_id', $userId)
                ->where('favorite_type', 'advertisements')
                ->pluck('favorite_id');
            return $query->whereIn('id', $favorite);
        }

        return $query;
    }

    public function scopeListBy($query, $listBy)
    {
        if ($listBy === 'rating') {
            return $query->orderBy('rate', 'desc');
        } elseif ($listBy === 'price_asc') {
            return $query->orderBy('price', 'ASC');
        } elseif ($listBy === 'price_desc') {
            return $query->orderBy('price', 'DESC');
        } elseif ($listBy === 'latest') {
            return $query->latest('id');
        } elseif ($listBy === 'popular') {
            return $query->orderBy('views', 'DESC');
        } elseif ($listBy === 'top') {
            return $query->orderBy('position', 'DESC');
        }

        return $query;
    }

    public function scopePagination($query, $limit)
    {
        if (is_null($limit) || $limit === '0')
            return $query->get();

        return $query->paginate($limit);
    }

    public function getIsFavoriteAttribute()
    {
//        dump(auth()->id());
//        dd(request()->user('sanctum'));
        if (!empty(request()->user('sanctum'))) {
            return Favorite::where('user_id', optional(request()->user('sanctum'))->id)
                ->where('favorite_type', 'advertisements')
                ->where('favorite_id', $this->id)
                ->exists();
        }
        return false;
    }
}
