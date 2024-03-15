<?php

namespace App\Http\Requests\Uploads;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UploadRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        /*$request = request()->all();
        if (isset($request['file']))
            unset($request['file']);*/
        return [
            'file' => 'required|array',
            'file.*' => 'required|file|mimes:jpeg,png,jpg,gif,svg,mp4,avi,bmp|max:102400',
        ];
    }
    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success'   => false,
            'data'      => $validator->errors()
        ]));
    }
}
