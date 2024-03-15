<?php

namespace App\Services\Favorite;

use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;

class FavoriteService
{
    public function add($data)
    {
        $data['user_id'] = Auth::id();
        $model = Favorite::query()->where($data);
        if (!$model->exists())
            Favorite::create($data);
    }

    public function delete($data)
    {
        $data['user_id'] = Auth::id();
        $model = Favorite::query()->where($data);
        if ($model->exists())
            $model->delete();
    }
}
