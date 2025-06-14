<?php

namespace Modules\Bookings\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Bookings\Models\Booking;
use Modules\Teams\Models\Team;
use Modules\Users\Models\User;
use Carbon\Carbon;
use Faker\Factory as Faker;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $date  = Carbon::now()->addDays(2)->toDateString();
        $faker = Faker::create();
        Team::all()->each(function ($team) use ($date)
        {
            $user = $team->tenant->users()->first();

            Booking::create([
                'tenant_id'  => $team->tenant_id,
                'user_id'    => $user->id,
                'team_id'    => $team->id,
                'date'       => $date,
                'start_time' => '10:00',
                'end_time'   => '11:00',
            ]);
        });
    }
}
