<?php

namespace Database\Seeders;

use App\Models\Degree;
use App\Models\Infrastructure;
use Illuminate\Database\Seeder;

class InfrastructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $infra_s = [
            'uz' => [
                "Kiyinish xonalari",
                "Tribuna",
                "Dush",
                "yoritish",
                "Avtomobillar to'xtash joyi",
            ],
            'ru' => [
                'Раздевалки',
                'Трибуны',
                'Душевая',
                'Освещение',
                'Парковка',
            ],
            'en' => [
                'Changing rooms',
                'Tribune',
                'Shower',
                'Lighting',
                'Parking',
            ]
        ];
        foreach ($infra_s['uz'] as $key => $value) {
            Infrastructure::create([
                'title_uz' => $value,
                'title_ru' => $infra_s['ru'][$key],
                'title_en' => $infra_s['en'][$key],
            ]);
        }
        Degree::create([
            'title_uz' => 'Boshlang’ich',
            'title_ru' => 'Начальный',
            'title_en' => 'Beginner',
        ]);
        Degree::create([
            'title_uz' => 'Havaskor ',
            'title_ru' => 'Продвинутый',
            'title_en' => 'Advanced',
        ]);
        Degree::create([
            'title_uz' => 'Professional',
            'title_ru' => 'Профессиональный',
            'title_en' => 'Professional',
        ]);
    }
}
