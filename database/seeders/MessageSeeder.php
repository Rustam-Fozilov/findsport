<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\TempUser;
use App\Models\User;
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
        $user = TempUser::find(1);

        $user->messages()->create([
            'chat_id' => 1,
            'message' => 'Hello World',
            'read' => false,
        ]);
    }
}
