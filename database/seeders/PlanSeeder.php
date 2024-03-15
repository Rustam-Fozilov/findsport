<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Plan;
use App\Models\Price;
use App\Models\Sport;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       Plan::create([
           'title_uz'=>'Eng mashxur e`lonlar',
           'title_ru'=>'Самые лучшие объявления',
           'title_en'=>'Best ads',
           'description_uz'=>'Eng mashxur e`lonlar',
           'description_ru'=>'Самые лучшие объявления',
           'description_en'=>'Best ads',
       ]);
       Price::create([
           'title_uz'=>"so'm",
           'title_ru'=>'сум',
           'title_en'=>"sum",
       ]);
    }
}
