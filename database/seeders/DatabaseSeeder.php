<?php

namespace Database\Seeders;

use App\Models\Advertisement;
use App\Models\Club;
use App\Models\Event;
use App\Models\Ground;
use App\Models\SectionItem;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(RolesTableSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(SiteSeeder::class);
        $this->call(PageSeeder::class);
        $this->call(DistrictSeeder::class);
        $this->call(InfrastructureSeeder::class);
        $this->call(OptionsSeeder::class);
        $this->call(SportSeeder::class);
        $this->call(PlanSeeder::class);
        $this->call(ChatSeeder::class);
        $this->call(MessageSeeder::class);
//        $this->call(ChatUserSeeder::class);
        Advertisement::factory(5)->create();
    }
}
