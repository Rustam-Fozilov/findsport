<?php

namespace App\Http\Requests\Api\Auth;


use App\Rules\PhoneRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ResendSmsConfirmRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'phone' => ['required', new PhoneRule(),
                Rule::exists('users', 'phone')->where(function ($query) {
                    $query->whereNotNull('phone_verified_at');
                }),
            ]
        ];
    }
}
