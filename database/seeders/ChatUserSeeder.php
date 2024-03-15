<?php

namespace Database\Seeders;

use App\Models\ChatUser;
use Illuminate\Database\Seeder;

class ChatUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ChatUser::query()->create([
            'user_id' => 2,
            'chat_id' => 1
        ]);
    }
}
