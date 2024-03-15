<?php

namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Message::query()->create([
            'chat_id' => 1,
            'sender_id' => 2,
            'receiver_id' => 1,
            'message' => 'Hello World',
            'read' => false,
        ]);
    }
}
