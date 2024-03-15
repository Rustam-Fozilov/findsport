<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class FileRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        $user_obj = auth()->user();
        $filePath = "public/uploads/temp/{$user_obj->id}/";
        $finalPath = storage_path("app/" . $filePath);
        return file_exists($finalPath.$value)||file_exists($value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return __('file not found');
    }
}
