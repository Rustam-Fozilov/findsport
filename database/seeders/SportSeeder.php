<?php

namespace Database\Seeders;

use App\Models\Sport;
use Illuminate\Database\Seeder;

class SportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sports = [
            'uz' => [
                'Basketbol',
                'Bodibilding',
                'Boks',
                'Bowling',
                'Dzyudo',
                'Fudbol',
                'Gimnastika',
                'Kamondan otish',
                'Karate',
                'Kibersport',
                'Kurash',
                'Og’ir atletika',
                'Qishki sport turlari',
                'Raqs',
                'Sambo',
                'Shahmat',
                'Shashka',
                'Stol tennis',
                'Suv sporti',
                'Taekwando',
                'Tennis',
                'Velosiped sporti',
                'Volleybol',
                'Xokkey',
                'Yengil atletika'
            ],
            'ru' => [
                'Баскетбол',
                'Бодибилд',
                'Заниматься боксом',
                'Боулинг',
                'Дзюдо',
                'Футбол',
                'Гимнастика',
                'Стрельба из лука',
                'Каратэ',
                'киберспорт',
                'борьба',
                'Гиревой спорт',
                'Зимние виды спорта',
                'танец',
                'Самбо',
                'Шахматы',
                'Шашки',
                'Настольный теннис',
                'Водные виды спорта',
                'Тхэквондо',
                'Большой теннис',
                'Езда на велосипеде',
                'Волейбол',
                'Хоккей',
                'Легкая атлетика'
            ],
            'en' => [
                'Basketball',
                'Bodibild',
                'Boxing',
                'Bowling',
                'Judo',
                'Football',
                'Gymnastics',
                'Archery',
                'Karate',
                'cybersport',
                'struggle',
                'Weightlifting',
                'Winter sports',
                'dance',
                'Sambo',
                'Chess',
                'Checkers',
                'Table Tennis',
                'Water Sports',
                'Taekwondo',
                'Tennis',
                'Cycling',
                'Volleyball',
                'Hockey',
                'Athletics'
            ]
        ];

        foreach ($sports['uz'] as $key=>$sport) {
            Sport::create([
                'title_uz'=> $sport,
                'title_ru'=> $sports['ru'][$key],
                'title_en'=> $sports['en'][$key],
            ]);
        }
    }
}
