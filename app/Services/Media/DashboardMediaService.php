<?php

namespace App\Services\Media;

use App\Models\Media;
use App\Services\Media\MediaService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DashboardMediaService extends MediaService
{
    public function storeMedia($attributes, Model $model, $type='image')
    {
        $ids = [];

        if (is_array($attributes)) {
            foreach ($attributes as $file) {
                $file = $this->createFile(['media' => $file], $type, $model->getTable());

                $ids[] = $file->id;
            }
        } else {
            $file = $this->createFile(['media' => $attributes], $type, $model->getTable());

            $ids[] = $file->id;
        }

        Media::query()->whereIn('id', $ids)
            ->update([
                'mediable_id' => $model->id,
                'mediable_type' => 'App\Models\\' . Str::of($model->getTable())->singular()->ucfirst()
            ]);
    }
}
