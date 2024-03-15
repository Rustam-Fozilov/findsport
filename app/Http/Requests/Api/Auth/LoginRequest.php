<?php

namespace App\Http\Requests\Api\Auth;

use App\Rules\PhoneRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LoginRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'phone' => [
                'required',
                Rule::exists('users','phone')->where(function ($query) {
                    $query->whereNotNull('phone_verified_at');
                }),
                new PhoneRule()
            ],
            'password'=>'required|string|min:5|max:255',
        ];
    }
}
