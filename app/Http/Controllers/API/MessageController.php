<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\ApiController;
use App\Http\Requests\StoreMessageRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends ApiController
{
    public function store(StoreMessageRequest $request)
    {
        $user = User::query()->where('uid', '=', $request['user_id'])->first();

        if (!$user) {
            $user = User::query()->create(['uid' => $request['user_id']]);
        }

        $message = Message::query()->create([
            'user_id' => $user->id,
            'message' => $request['message'],
            'read' => false,
        ]);
    }
}
