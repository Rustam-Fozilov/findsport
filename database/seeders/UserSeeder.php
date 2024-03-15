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
            'phone' => '99899123456',
            'login' => 'admin',
            'password' => Hash::make('admin'),
            'role_id' => 1
        ]);

        User::create([
            'phone' => '998990000000',
            'login' => 'user',
            'password' => Hash::make('user'),
            'role_id' => 3
        ]);
    }
}
