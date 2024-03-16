<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\ApiController;
use App\Http\Requests\StoreMessageRequest;
use App\Models\Chat;
use App\Models\Message;
use App\Models\TempUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends ApiController
{
    public function index(Request $request)
    {
        $request->validate([
           'receiver_id' => 'required|integer|exists:users,id',
           'unread' => 'nullable|boolean'
        ]);

        $messagesQuery = Message::query()->where('receiver_id', '=', $request['receiver_id']);

        if ($request['unread']) {
            $messagesQuery->where('read', '=', false);
        }

        $messages = $messagesQuery->get();

        return $this->success('all messages', $messages);
    }

    public function store(StoreMessageRequest $request)
    {
        $sender = TempUser::firstOrCreate(['uid' => $request['sender_id']]);
        $user = User::find($request['user_id']);

        if (!$user) {
            return $this->error('receiver user not found');
        }

        $message = Message::query()
            ->where('messageable_type', '=', 'App\Models\TempUser')
            ->where('messageable_id', '=', $sender->id)
            ->whereHas('chat', function ($query) use ($sender, $request) {
                $query->where('owner_id', '=', $request['user_id']);
            })
            ->first();

        if ($message) {
            $sender->messages()->create([
                'chat_id' => $message['chat_id'],
                'message' => $request['message'],
                'read' => false,
            ]);
        } else {
            $chat = Chat::query()->create([
                'owner_id' => $request['user_id']]
            );

            $sender->messages()->create([
                'chat_id' => $chat->id,
                'message' => $request['message'],
                'read' => false,
            ]);
        }

        return $this->success('message sent');
    }
}
