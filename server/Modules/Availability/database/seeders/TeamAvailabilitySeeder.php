<?php

namespace Modules\Availability\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Availability\Models\TeamAvailability;
use Modules\Teams\Models\Team;

class TeamAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        Team::all()->each(function ($team) use ($days) {
            foreach ($days as $day) {
                TeamAvailability::create([
                    'team_id' => $team->id,
                    'day_of_week' => $day,
                    'start_time' => '09:00',
                    'end_time' => '17:00',
                ]);
            }
        });
    }
}
