<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Api\Auth\FillProfileRequest;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\RegistrationRequest;
use App\Http\Requests\Api\Auth\ResendSmsConfirmRequest;
use App\Http\Requests\Api\Auth\SmsConfirmRequest;
use App\Models\User;
use App\Models\UserDevice;
use App\Services\Sms\SmsService;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends ApiController
{

    public function authenticate(Request $request, UserService $userService): JsonResponse
    {
        try {
            $login = $request->validated()['phone'];
            $password = $request->validated()['password'];
            $user = $userService->authenticateWithPass($login, $password);
            if (!empty($user)) {
                return $this->success(__('messages.success'), ['token' => $user->auth_token]);
            } else {
                return $this->error(__('The provided credentials are incorrect.'), null, 401);
            }
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }


    public function Registration(RegistrationRequest $request, SmsService $smsService): JsonResponse
    {

        $user = User::query()->firstOrCreate(
            [
                'phone' => $request->validated()['phone']
            ], $request->validated() + [
                'login' => $request->validated()['phone'],
                'password' => $request->validated()['phone'],
                'role_id' => 3
            ]);

        UserDevice::query()->firstOrCreate(
            [
                'user_id' => $user->id,
                'push_token' => $request->validated()['fcm']
            ],
        );
        try {
            $smsService->sendConfirm($request->validated()['phone'], 'telegram');
            return $this->success(__('sms.confirmation_sent', ['attribute' => $request->validated()['phone']]));
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }


    /**
     * @param SmsConfirmRequest $request
     * @param SmsService $smsService
     * @param UserService $userService
     * @return JsonResponse
     */
    public function authConfirm(SmsConfirmRequest $request, SmsService $smsService, UserService $userService): JsonResponse
    {
        try {
            if ($smsService->confirm($request->json('phone'), $request->json('code'))) {
                $userWithToken = $userService->generateToken($request->json('phone'));
                if (!empty($userWithToken->phone_verified_at)) {
                    return $this->success(__('messages.success'), ['token' => $userWithToken->auth_token]);
                } else {
                    return $this->success(__('Fill in the user information'), ['url' => route('fillProfile')]);
                }
            }
            return $this->error(__('sms.invalid_code'));
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }


    /**
     * @param ResendSmsConfirmRequest $request
     * @param SmsService $smsService
     * @return JsonResponse
     */
    public function resendSms(ResendSmsConfirmRequest $request, SmsService $smsService): JsonResponse
    {
        try {
            $smsService->sendConfirm($request->json('phone'), 'telegram');
            return $this->success(__('sms.confirmation_sent', ['attribute' => $request->json('phone')]));
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }

    public function fillProfile(FillProfileRequest $request, UserService $userService): JsonResponse
    {
        $user = User::query()->where(['phone' => $request->json('phone')])->first();
        $userWithToken = $userService->generateToken($request->json('phone'));
        $filled_fields = $request->except('phone');
        $user->update($filled_fields);
        return $this->success(__('messages.success'), ['token' => $userWithToken->auth_token]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        // auth()->user()->tokens()->delete();

        return $this->success(__('messages.success'));
    }

    public function refreshToken(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return $this->success('', ['token' => $user->createToken($user->phone)->plainTextToken]);
    }
}
