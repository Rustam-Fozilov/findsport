<?php


namespace App\Enums;


class StatusEnum extends BaseEnum
{
    public const ACTIVE = 'active';
    public const PENDING = 'pending';
    public const REJECTED = 'rejected';
    public const INACTIVE = 'inactive';
    public const BLOCKED = 'blocked';
}
