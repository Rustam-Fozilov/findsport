<?php

namespace App\Casts;


use App\Http\Request;
use App\Models\Ground;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use stdClass;

class TranslatableJson implements CastsAttributes
{

    /**
     * Transform the resource into an array.
     *
     * @param $model
     * @param $key
     * @param $value
     * @param $attributes
     * @return mixed
     */
    public function get($model, $key, $value, $attributes)
    {
        $arr = json_decode($value, true);
        //dd($key, $value, $attributes, $model);
        if (str_contains(request()->path(),'admin') &&
            str_contains(request()->path(),'edit')  &&
            in_array($key, ['title', 'description']) &&
            $model instanceof Ground

        )
            return $arr;
        return $arr[app()->getLocale()] ?? $arr['ru'] ?? $arr['uz'] ?? $value;
    }

    /**
     * Prepare the given value for storage.
     *
     * @param Model $model
     * @param string $key
     * @param mixed $value
     * @param $attributes
     * @return false|string
     */
    public function set($model, string $key, $value, $attributes)
    {
        return json_encode($value);
    }

    /**
     * Get the serialized representation of the value.
     *
     * @param $model
     * @param string $key
     * @param mixed $value
     * @param array $attributes
     * @return mixed
     */
    public function serialize($model, string $key, $value, array $attributes)
    {
        return json_decode($attributes[$key], true);
    }
}
