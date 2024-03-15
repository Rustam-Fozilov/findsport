<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Sport;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       Page::create([
           'name' => [
               'ru' => 'О нас',
               'uz' => 'Biz haqimizda',
           ],
           'description' => [
               'ru' => 'О нас',
               'uz' => 'Biz haqimizda',
           ],
           'slug' => 'about',
       ]);

        Page::create([
            'name' => [
                'ru' => 'Контакты',
                'uz' => 'Bog`lanish',
            ],
            'description' => [
                'ru' => 'Контакты',
                'uz' => 'Bog`lanish',
            ],
            'slug' => 'contacts',
        ]);
        Page::create([
            'name' => [
                'ru' => 'Правила',
                'uz' => 'Qoidalar',
            ],
            'description' => [
                'ru' => 'Правила',
                'uz' => 'Qoidalar',
            ],
            'slug' => 'rules',
        ]);
        Page::create([
            'name' => [
                'ru' => 'Добавить объект',
                'uz' => 'Obyekt qo`shish',
            ],
            'description' => [
                'ru' => 'Добавить объект',
                'uz' => 'Obyekt qo`shish',
            ],
            'slug' => 'add-object',
        ]);
    }
}
