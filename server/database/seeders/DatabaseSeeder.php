<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
                $this->call([
                     \Modules\Tenants\database\seeders\TenantSeeder::class,
                     \Modules\Users\database\seeders\UserSeeder::class,
                     \Modules\Teams\database\seeders\TeamSeeder::class,
                     \Modules\Bookings\database\seeders\BookingSeeder::class,
                     \Modules\Availability\database\seeders\TeamAvailabilitySeeder::class,
                ]);
    }
}
