<?php

namespace App\Http\Requests\Sports;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Sport;

class UpdateSportRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
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
        return Sport::$rules;
    }
}
