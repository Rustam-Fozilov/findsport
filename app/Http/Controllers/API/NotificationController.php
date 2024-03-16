<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function notifications()
    {
        return $this->success('notifications', auth()->user()->unreadNotifications);
    }

    public function markAsRead(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:notifications,id'
        ]);

        $notification = auth()->user()->unreadNotifications()->find($request['id']);

        if (!$notification) {
            return $this->error('Notification not found');
        }

        $notification->markAsRead();
        return $this->success('marked as read', $notification);
    }
}
