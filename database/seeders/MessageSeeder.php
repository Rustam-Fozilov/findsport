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
            'user_id' => 2,
            'message' => 'Hello World',
            'read' => false,
        ]);
    }
}
