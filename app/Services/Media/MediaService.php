<?php

namespace App\Services\Media;


use App\Jobs\Media\DeleteOriginalImage;
use App\Models\Media;
use finfo;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;


class MediaService
{
    public function create(array $attributes, $model, $mediable_id)
    {
        $type=$this->isImageOrVideo($attributes['media']);
        if ($attributes['media'] instanceof UploadedFile)
            $uploadedFile = Media::uploadFile($attributes['media'], $model, $mediable_id);
        else {
            $attributes['media'] = $this->pathToUploadedFile($attributes['media']);
            $uploadedFile = Media::uploadFile($attributes['media'], $model, $mediable_id);
        }

        $media = $mediable_id
            ? Media::where('model', $model)
                ->where('mediable_id', $mediable_id)
                ->where('type', $type)->first()
            : null;
        if (!str_contains(config('app.url'), 'http'))
            $siteUrl = 'https://' . config('app.url');
        else
            $siteUrl = config('app.url');
        if ($media) {
            $this->deleteFile($media);
            $media->update([
                'size' => $attributes['media']->getSize(),
                'mime_type' => $attributes['media']->getClientMimeType(),
                'url' => /*$siteUrl .*/ Str::replaceFirst('public', '/storage', $uploadedFile),
                'path' => '/' . $uploadedFile,
            ]);
        } else {
            $media = Media::create([
                'model' => $model,
                'mediable_id' => $mediable_id,
                'mediable_type' => $model,
                'type' => $type,
                'size' => $attributes['media']->getSize(),
                'mime_type' => $attributes['media']->getClientMimeType(),
                'url' => /*$siteUrl .*/ Str::replaceFirst('public', '/storage', $uploadedFile),
                'path' => '/' . $uploadedFile,
            ]);
        }
       /* if(!empty(auth()?->user()?->id)){
            $user_obj=auth()?->user();
            $filePath = "public/uploads/temp/{$user_obj->id}/";
            $finalPath = storage_path("app/".$filePath);
            if (File::exists($finalPath)){
                File::deleteDirectory($finalPath);
            }
        }*/
        return $media;
    }


    public function delete($media)
    {
        if ($media instanceof Collection) {
            foreach ($media as $medium) {
                $this->deleteFile($medium);
            }
            Media::query()->whereIn('id', $media->pluck('id'))->delete();
        } else {

            $this->deleteFile($media);

            $media->delete();
        }
    }

    private function deleteFile(Media $media)
    {

        DeleteOriginalImage::dispatch($media);
    }

    public function thumbnails()
    {
    }

    public function download($post)
    {
        if ($post->media->isEmpty())
            return redirect()->back();
        $path = storage_path('app');
        $exists=false;
        foreach ($post->media as $media) {
            $file = $path . $media->path;
            if(File::exists($file)){
                $exists=true;
                break;
            }
        }
        if (!$exists)
            return redirect()->back();
        if (!is_dir(public_path('downloads'))) {
            mkdir(public_path('downloads'), 0744, true);
        }
        $zipfile = 'downloads/download_' . $post->id .'_'. $post->created_at->timestamp . '.zip';
        if (File::exists($zipfile))
            return response()->download($zipfile);
        $zip = new \ZipArchive();
        $zip->open($zipfile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
        foreach ($post->media as $media) {
            $file = $path . $media->path;
            if(File::exists($file)){
                $zip->addFile($file, basename($file));
            }
        }
        $zip->close();
        $post->update(['downloads' => $post->downloads + 1]);
        return response()->download($zipfile);
    }

    /**
     * Create an UploadedFile object from absolute path
     *
     * @param string $path
     * @param bool $test default true
     * @return    object(Illuminate\Http\UploadedFile)
     *
     * Based of Alexandre Thebaldi answer here:
     * https://stackoverflow.com/a/32258317/6411540
     */
    public function pathToUploadedFile($path, $test = true)
    {
        $filesystem = new Filesystem;

        $name = $filesystem->name($path);
        $extension = $filesystem->extension($path);
        $originalName = $name . '.' . $extension;
        $mimeType = $filesystem->mimeType($path);
        $error = null;

        return new UploadedFile($path, $originalName, $mimeType, $error, $test);
    }
    function isImageOrVideo($file) {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file);

        if(strpos($mimeType, 'image/') === 0)
            return Media::TYPE_IMAGE;
        elseif (strpos($mimeType, 'video/') === 0)
            return Media::TYPE_VIDEO;
        else
            return Media::TYPE_OTHER;
    }
}
