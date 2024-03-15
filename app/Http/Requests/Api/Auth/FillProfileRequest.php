<?php

namespace App\Http\Requests\Api\Auth;

use App\Rules\PhoneRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FillProfileRequest extends FormRequest
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
                new PhoneRule(),
                Rule::exists('users','phone')->where(function ($query) {
                    $query->whereNotNull('phone_verified_at');
                }),
            ],
            'first_name'=>'required|string',
            'last_name'=>'nullable|string',
            'email'=>'nullable|email',
            'password'=>'required|string|min:5|max:255',
            'confirm_password'=>'required|required_with:password|same:password',
        ];
    }
}
