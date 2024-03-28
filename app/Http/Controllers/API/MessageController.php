<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\ApiController;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Chat;
use App\Models\Message;
use App\Models\TempUser;
use App\Models\User;
use App\Notifications\MessageSentNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
           'chat_id' => 'required|integer|exists:chats,id',
           'unread' => 'nullable|boolean'
        ]);

        $messages = Message::query()
            ->whereHas('chat', function ($query) use ($request) {
                $query->where('id', $request['chat_id']);
            });

        if ($request['unread']) {
            $messages->where('read', '=', false);
        }

        $messages = $messages->get();

        return $this->success('all messages', $messages);
    }

    public function sendToAdmin(StoreMessageRequest $request): JsonResponse
    {
        $sender = TempUser::firstOrCreate(['uid' => $request['client_id']]);
        $user = User::find($request['admin_id']);

        if (!$user) {
            return $this->error('receiver user not found');
        }

        $message = Message::query()
            ->where('messageable_type', '=', 'App\Models\TempUser')
            ->where('messageable_id', '=', $sender->id)
            ->whereHas('chat', function ($query) use ($sender, $request) {
                $query->where('owner_id', '=', $request['admin_id']);
            })
            ->first();

        if ($message) {
            $chatId = $message->chat_id;
        } else {
            $chat = Chat::query()->create(['owner_id' => $request['admin_id']]);
            $chatId = $chat->id;
        }

        $message = $sender->messages()->create([
            'chat_id' => $chatId,
            'message' => $request['message'],
            'read' => false,
        ]);

        $user->notify(new MessageSentNotification($message));

        return $this->success('message sent to chat', $message);
    }

    public function sendToClient(Request $request): JsonResponse
    {
        $request->validate(['client_id' => 'required', 'message' => 'required']);

        $user = auth()->user();
        $sender = TempUser::query()->where('uid', $request['client_id'])->first();

        if (!$user || !$sender) {
            return $this->error('receiver or sender user not found');
        }

        $message = Message::query()
            ->where('messageable_type', '=', 'App\Models\TempUser')
            ->where('messageable_id', '=', $sender->id)
            ->whereHas('chat', function ($query) use ($sender, $request) {
                $query->where('owner_id', '=', auth()->user()->id);
            })
            ->first();

        if (!$message) {
            return $this->error('chat not found');
        }

         $message = $user->messages()->create([
            'chat_id' => $message->chat_id,
            'message' => $request['message'],
            'read' => false
        ]);

        return $this->success('message sent to chat', $message);
    }
}
