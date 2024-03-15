<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Class SmsConfirm
 * @package App\Models
 * @property string id
 * @property string phone
 * @property string code
 * @property integer try_count
 * @property integer resend_count
 * @property Carbon expired_at
 * @property Carbon|null unblocked_at
 */
class SmsConfirm extends Model
{
    use HasFactory;

    public const MAX_TRY_COUNT = 5;
    public const MAX_RESEND_COUNT = 3;
    public const SMS_EXPIRY_SECONDS = 120;
    public const BLOCKED_MINUTES = 15;

    protected $fillable = [
        'phone',
        'code',
        'try_count',
        'resend_count',
        'expired_at',
        'unblocked_at'
    ];

    protected $casts = [
        'expired_at' => 'datetime',
        'unblocked_at' => 'datetime',
    ];


    /**
     * @return bool
     */
    public function isBlocked(): bool
    {
        return $this->unblocked_at !== null && $this->unblocked_at->greaterThan(Carbon::now());
    }

    /**
     * @return bool
     */
    public function isBlockExpired(): bool
    {
        return $this->unblocked_at !== null && $this->unblocked_at->lessThan(Carbon::now());
    }

    /**
     * @return bool
     */
    public function isOutOfTries(): bool
    {
        return $this->unblocked_at === null && $this->try_count > self::MAX_TRY_COUNT;
    }

    /**
     * @return bool
     */
    public function isOutOfResendLimit(): bool
    {
        return $this->unblocked_at === null && $this->resend_count > self::MAX_RESEND_COUNT;
    }

    /**
     * @return bool
     */
    public function SmsExpirySeconds(): bool
    {
        return $this->unblocked_at === null && $this->expired_at->lessThan(Carbon::now());
    }

    /**
     * @param string $phone
     * @return bool
     */
    public function isPhoneBlocked(string $phone): bool
    {
        $sms = self::query()->where(['phone' => $phone])->get()->first();
        return $sms !== null && $sms->unblocked_at !== null && $sms->unblocked_at->greaterThan(Carbon::now());
    }

    /**
     * @return bool
     */
    public function deletePhone(): bool
    {
        return $this->delete();
    }

    public function getChatIdAttribute()
    {
        //Phone class not exists, advertisement_phone table:advertisement_id,name,phone
        $tg_user = DB::table('tg_users')
            ->join('users', 'tg_users.user_id', '=', 'users.id')
            ->where('users.phone', $this->phone)
            ->select('users.phone', 'tg_users.tg_id')->first();
        return $tg_user->tg_id;
    }
}
