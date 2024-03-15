<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Api\UserUpdateRequest;
use App\Resources\API\v1\UserResource;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends ApiController
{

    public function __construct(UserService $service)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(__('messages.success'), ['user'=>new UserResource(auth()->user())]);
    }


    public function update(UserUpdateRequest $request): JsonResponse
    {
        $this->service->update($request->validated(), auth()->user());
        return $this->success(__('messages.success'), new UserResource(Auth::user()));
    }


}
