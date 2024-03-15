<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\ApiController;
use App\Http\Requests\StoreMessageRequest;
use App\Models\Advertisement;
use App\Models\Chat;
use App\Models\Message;
use App\Models\User;
use App\Notifications\MessageSentNotification;
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
        $user = $request->user();

    }

//    public function store(StoreMessageRequest $request)
//    {
//        $sender = User::query()->where('uid', '=', $request['sender_id'])->first();
//        $receiver = User::find($request['receiver_id']);
//
//        if (!$receiver) {
//            return $this->error('receiver not found');
//        }
//
//        if (!$sender) {
//            $sender = User::query()->create(['uid' => $request['sender_id']]);
//            $user_chat = Chat::query()->create([]);
//        } else {
//            $user_chat = Message::query()->where('sender_id', '=', $sender->id)->first()->chat;
//        }
//
//        $message = Message::query()->create([
//            'chat_id' => $user_chat->id,
//            'sender_id' => $sender->id,
//            'receiver_id' => $receiver->id,
//            'message' => $request['message'],
//            'read' => false,
//        ]);
//
//        $receiver->notify(new MessageSentNotification($message));
//
//        return $this->success('message sent', $message);
//    }
}
