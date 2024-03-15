<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Uploads\DeleteRequest;
use App\Http\Requests\Uploads\UploadRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Pion\Laravel\ChunkUpload\Exceptions\UploadFailedException;
use Illuminate\Http\UploadedFile;
use Pion\Laravel\ChunkUpload\Exceptions\UploadMissingFileException;
use Pion\Laravel\ChunkUpload\Handler\AbstractHandler;
use Pion\Laravel\ChunkUpload\Handler\HandlerFactory;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;
use App\Models\Media;

class UploaderController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Handles the file upload
     *
     * @param Request $request
     *
     * @return JsonResponse
     *
     * @throws UploadMissingFileException
     * @throws UploadFailedException
     */
//    public function upload(UploadRequest $request)
//    {
//            // create the file receiver
//            $receiver = new FileReceiver("file", $request, HandlerFactory::classFromRequest($request));
//
//            // check if the upload is success, throw exception or return response you need
//            if ($receiver->isUploaded() === false) {
//                throw new UploadMissingFileException();
//            }
//
//            // receive the file
//            $save = $receiver->receive();
//
//            // check if the upload has finished (in chunk mode it will send smaller files)
//            if ($save->isFinished()) {
//                // save the file and return any response you need, current example uses `move` function. If you are
//                // not using move, you need to manually delete the file by unlink($save->getFile()->getPathname())
//                return $this->saveFile($save->getFile(), $request);
//            }
//
//            // we are in chunk mode, lets send the current progress
//            /** @var AbstractHandler $handler */
//            $handler = $save->handler();
//
//        return response()->json([
//            "done" => $handler->getPercentageDone(),
//            'status' => true
//        ]);
//    }
    public function upload(UploadRequest $request)
    {
        // Retrieve the files from the request
        $files = $request->file('file');

        // Initialize an array to store the saved file paths
        $savedFiles = [];

        // Loop through each file
        foreach ($files as $file) {
            // create the file receiver for each file
            $receiver = new FileReceiver($file, $request, HandlerFactory::classFromRequest($request));

            // check if the upload is success, throw exception or return response you need
            if ($receiver->isUploaded() === false) {
                throw new UploadMissingFileException();
            }

            // receive the file
            $save = $receiver->receive();

            // check if the upload has finished
            if ($save->isFinished()) {
                // save the file and store the saved file path
                $savedFiles[] = $this->saveFile($save->getFile(), $request)->original['name'];
            } else {
                // we are in chunk mode, send the current progress
                /** @var AbstractHandler $handler */
                $handler = $save->handler();
                return response()->json([
                    "done" => $handler->getPercentageDone(),
                    'status' => true
                ]);
            }
        }

        // Return response indicating successful upload of all files
        return response()->json([
            'status' => true,
            'message' => 'Files uploaded successfully',
            'files' => $savedFiles
        ]);
    }

    /**
     * Saves the file
     *
     * @param UploadedFile $file
     *
     * @return JsonResponse
     */
    protected function saveFile(UploadedFile $file, Request $request)
    {
        $user_obj = auth()->user();
        $fileName = $this->createFilename($file);
        // Get file mime type
        $mime_original = $file->getMimeType();
        $mime = str_replace('/', '-', $mime_original);

        $folderDATE = $request->dataDATE;

        $folder = $folderDATE;
        $filePath = "public/uploads/temp/{$user_obj->id}/";
        $finalPath = storage_path("app/" . $filePath);

        $fileSize = $file->getSize();
        // move the file name
        $file->move($finalPath, $fileName);

        $url_base = 'storage/uploads/temp/' . $user_obj->id . "/" . $fileName;

        return response()->json([
            'path' => $filePath,
            'name' => $fileName,
            'mime_type' => $mime
        ]);
    }

    /**
     * Create unique filename for uploaded file
     * @param UploadedFile $file
     * @return string
     */
    protected function createFilename(UploadedFile $file)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = str_replace("." . $extension, "", $file->getClientOriginalName()); // Filename without extension
        /*  if (str_contains('_', $filename)) {
              //delete timestamp from file name
              $temp_arr = explode('_', $filename);
              if (isset($temp_arr[0])) unset($temp_arr[0]);
              $filename = implode('_', $temp_arr);
          }*/
        //here you can manipulate with file name e.g. HASHED
        return $filename . "." . $extension;
    }

    /**
     * Delete uploaded file WEB ROUTE
     * @param Request request
     * @return JsonResponse
     */
    public function delete(DeleteRequest $request)
    {

        $user_obj = auth()->user();

        $file = $request->filename;
        /* if (str_contains('_', $file)) {
             //delete timestamp from filename
             $temp_arr = explode('_', $file);
             if (isset($temp_arr[0])) unset($temp_arr[0]);
             $file = implode('_', $temp_arr);
         }*/

        $dir = $request->date;

        $filePath = "public/uploads/temp/{$user_obj->id}/";
        $finalPath = storage_path("app/" . $filePath);

        if (unlink($finalPath . $file)) {
            return response()->json([
                'status' => 'ok'
            ], 200);
        } else {
            return response()->json([
                'status' => 'error'
            ], 403);
        }
    }

}

