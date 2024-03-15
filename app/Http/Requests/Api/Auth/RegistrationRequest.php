<?php

namespace App\Http\Requests\Api\Auth;

use App\Rules\PhoneRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegistrationRequest extends FormRequest
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
                Rule::unique('users')->where(function ($query) {
                    $query->whereNotNull('phone_verified_at')->whereNotNull(['first_name','last_name']);
                }),
                new PhoneRule()
            ],
            'locale'=> 'required|string',
            'fcm' => 'required|nullable|string'
        ];
    }
}
