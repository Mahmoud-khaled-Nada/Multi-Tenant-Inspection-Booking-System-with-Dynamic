<?php

namespace Modules\Users\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Users\Models\User;
use Modules\Tenants\Models\Tenant;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        //call faker
        $faker = Faker::create();
        Tenant::all()->each(function ($tenant) use ($faker)
        {
            $roles = ['admin', 'manager', 'inspector'];
            $key   = array_rand($roles);
            $role  = $roles[$key];

            User::create([
                'tenant_id' => $tenant->id,
                'name'      => $faker->name,
                'email'     => $faker->email,
                'role'      => $role,
                'password'  => bcrypt('password'),
            ]);
        });

        User::first()->update([
            'name'  => "Admin Demo",
            'email' => "admin@demo.com",
            'role'  => "admin",
        ]);
    }
}
