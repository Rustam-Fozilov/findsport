<?php

namespace Database\Seeders;

use App\Models\Sport;
use App\Services\Media\MediaService;
use Illuminate\Database\Seeder;

class SportIconSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*
         1	Basketbol
         2	Bodibilding
         3	Boks
         4	Bowling
         5	Dzyudo
         6	Fudbol
         7	Gimnastika
         8	Kamondan otish
         9	Karate
         10	Kibersport
         11	Kurash
         12	Og’ir atletika
         13	Qishki sport turlari
         14	Raqs
         15	Sambo
         16	Shahmat
         17	Shashka
         18	Stol tennis
         19	Suv sporti
         20	Taekwando
         21	Tennis
         22	Velosiped sporti
         23	Volleybol
         24	Xokkey
         25	Yengil atletika
        */
        $path = database_path() . '/seeders/icons/';
        $icons = [
            1 => 'basketbol.png',
            6 => 'futbol.png',
            7 => 'gimnastika.png',
            14 => 'raqs.png',
            9 => 'karate.png',
//            3 => 'paintbal.png',
            18 => 'ping.png',
//            3 => 'playstation.png',
            10 => 'Kibersport.png',
        ];
        $service = new MediaService();
        foreach ($icons as $sport_id => $file) {
            $service->create(['media' => $path . $file], 'sports', $sport_id);
        }
    }
}
