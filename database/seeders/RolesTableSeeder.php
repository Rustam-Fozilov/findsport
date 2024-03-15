<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $crud=[
            'view' => true,
            'create' => true,
            'update' => true,
            'delete' => true
        ];
        # Админ
        Role::create([
            'name' => 'Админ',
            'permissions' => [
                'admin' => [
                    'view' => true,
                    'update' => true,
                ],
                'site' => [
                    'view' => true
                ],
                'users' => $crud,
                'region' => $crud,
                'metro' => $crud,
                'coating' => $crud,
                'playgrounds' => $crud,
                'events' => $crud,
                'clubs' => $crud,
                'sport' => $crud,
                'section' => $crud,
                'type' => $crud,
                'inventory' => $crud,
                'option' => $crud
            ]
        ]);

        # Менеджер
        Role::create([
            'name' => 'Менеджер',
            'permissions' => [
                'clubs' => $crud,
                'playgrounds' => $crud,
                'events' => $crud,

            ]
        ]);

        # Ползователь
        Role::create([
            'name' => 'Ползователь',
            'permissions' => [

                'playgrounds' => [
                    'view' => true
                ],
                'events' => [
                    'view' => true
                ],
                'clubs' => [
                    'view' => true
                ],
                'sections' => [
                    'view' => true
                ],
            ]
        ]);
    }
}
