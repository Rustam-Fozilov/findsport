<?php

namespace Database\Seeders;

use App\Models\TempUser;
use Illuminate\Database\Seeder;

class TempUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TempUser::query()->create([
            'uid' => 'www'
        ]);
    }
}
