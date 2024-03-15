<?php

namespace App\Jobs\Media;

use App\Models\Media;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use Illuminate\Http\File;

class CreateThumbnail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    /**
     * @var Media
     */
    private $media;
    private $model;
    private $width;
    private $height;
    private $type;

    /**
     * Create a new job instance.
     *
     * @param Media $media
     * @param $model
     * @param $width
     * @param $height
     * @param $type
     */
    public function __construct(Media $media, $model, $width, $height, $type)
    {
        $this->media = $media;
        $this->model = $model;
        $this->width = $width;
        $this->height = $height;
        $this->type = $type;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $originalFile = new File(storage_path('app' . $this->media->path));

        $file = Image::make($originalFile)
            ->resize($this->width, $this->height, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

        $location = 'public/uploads/thumbnails/' . $this->type . '/' . $this->model . '/' . $file->basename;
        $file->save(storage_path('app/' . $location));

        $this->media->update([
            "$this->type" => '/' . $location,
        ]);

        //$file->destroy();


    }
}
