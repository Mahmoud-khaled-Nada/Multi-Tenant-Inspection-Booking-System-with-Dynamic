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
            User::create([
                'tenant_id' => $tenant->id,
                'name'      => $faker->name,
                'email'     => $faker->email,
                'password'  => bcrypt('password'),
            ]);
        });

        User::first()->update([
            'name'  => "Admin Demo",
            'email' => "admin@demo.com",
        ]);
    }
}
