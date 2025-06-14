<?php

namespace Modules\Teams\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Teams\Models\Team;
use Modules\Tenants\Models\Tenant;
use Faker\Factory as Faker;


class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        Tenant::all()->each(function ($tenant) use ($faker)
        {
            Team::create([
                'tenant_id' => $tenant->id,
                'name'      => $faker->company,
            ]);
        });
    }
}
