<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Site;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Page::create([
            'name'=>[
            'name' => 'Findsport.uz',
            'phone' => '+998912341234',
            'socials' => [
                'facebook' => 'https://www.facebook.com/',
                'instagram' => 'https://www.instagram.com/',
                'youtube' => 'https://www.youtube.com/',
                'vk' => 'https://www.vk.com/',

            ],
            'banner'=>[
                'top'=>'',
                'bottom'=>'',
            ]
            ]
        ]);


    }
}
