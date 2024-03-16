<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'phone' => '998991234567',
            'login' => 'admin',
            'password' => 'admin',
            'role_id' => 1,
            'phone_verified_at' => now(),
        ]);

        User::create([
            'phone' => '998990000000',
            'login' => 'user',
            'password' => 'user',
            'role_id' => 3,
            'phone_verified_at' => now(),
        ]);
    }
}
