<?php
/**
 * Created by Maxamadjonov Jaxongir.
 * User: Php
 * Date: 02.01.2021
 * Time: 19:37
 */

namespace App\Services\User;


use App\Enums\StatusEnum;
use App\Models\Media;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class UserService
{
    /**
     * @var Media
     */
    private $image;

    public function __construct()
    {
        $this->image = new Media();
    }

    public function all($role_id = false)
    {
        return User::with('role')
            ->latest('id')
            ->roleId($role_id)
            ->get();
    }

    public function authenticateWithPass($login, $password)
    {
        $user = User::query()->where('phone', $login)->first();
        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }
        $token = $user->createToken($login);
        $user->auth_token = $token->plainTextToken;
        return $user;
    }

    public function create(array $attributes)
    {
        $user = User::create($attributes);
        if (array_key_exists('image', $attributes)) {
            $file = $this->image->uploadFile($attributes['image'], 'users');

            $user->image()->create([
                'url' => '/' . $file
            ]);
        }


        return $user;
    }

    public function update(array $attributes, User $user)
    {
        $user->update($attributes);
        if (array_key_exists('avatar', $attributes)) {
            if ($user->avatar()->exists()) {
                $user->avatar->removeFile();
                $user->avatar()->delete();
            }

            $file = $this->image->uploadFile($attributes['avatar'], User::CUSTOMER);

            $user->avatar()->create([
                'url' => '/' . $file
            ]);
            $user->load('avatar');
        }
        return $user;
    }

    /**
     * @param string $phone
     * @return User
     * @throws UserNotFoundException
     */
    public function generateToken(string $phone): User
    {
        /**
         * @var User $user
         */
        $user = User::query()->where(['phone' => $phone])->get()->first();
        if ($user === null) {
            throw new UserNotFoundException(__('messages.not_found'));
        }
//        $token = $user->tokens()->where(['name' => $deviceUID])->get()->first();
//        if ($token !== null) {
//            $token->delete();
//        }
        $this->confirmPhoneUser($user);
        $token = $user->createToken($phone);
        $user->auth_token = $token->plainTextToken;
        return $user;
    }

    /**
     * @param User $user
     */
    private function confirmPhoneUser(User $user): void
    {
        $user->phone_verified_at = now();
        if (!in_array($user->status, [StatusEnum::ACTIVE, StatusEnum::BLOCKED], true)) {
            $user->status = StatusEnum::ACTIVE;
            $user->update();
        }
    }

    /**
     * @param User $user
     */
    public function verifyEmailUser(User $user): void
    {
        $user->email_verified_at = now();
        if (!in_array($user->status, [StatusEnum::ACTIVE, StatusEnum::BLOCKED], true)) {
            $user->status = StatusEnum::ACTIVE;
            $user->update();
        }
    }

    public function delete(User $user)
    {
        return $user->delete();
    }

}
