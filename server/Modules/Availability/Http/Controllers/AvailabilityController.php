<?php

namespace Modules\Availability\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Modules\Availability\Models\TeamAvailability;
use Modules\Bookings\Models\Booking;
use Modules\Teams\Models\Team;

class AvailabilityController extends Controller
{
    public function setAvailability(Request $request, $id)
    {
        $request->validate([
            'availability'               => 'required|array',
            'availability.*.day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'availability.*.start_time'  => 'required|date_format:H:i',
            'availability.*.end_time'    => 'required|date_format:H:i|after:availability.*.start_time',
        ]);

        $team = Team::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);

        // Step 1: Retrieve all bookings for this team
        $bookings = Booking::where('team_id', $team->id)->get();

        // Step 2: Validate for booking conflicts
        foreach ($request->availability as $slot) {
            $startTime = $slot['start_time'];
            $endTime   = $slot['end_time'];
            $dayOfWeek = $slot['day_of_week'];

            // Check for any booking on the same day of the week and overlapping time
            $conflict = $bookings->filter(function ($booking) use ($dayOfWeek, $startTime, $endTime) {
                $bookingDay = Carbon::parse($booking->date)->format('l'); // Get day name from date
                if ($bookingDay !== $dayOfWeek) return false;

                return (
                    ($booking->start_time < $endTime && $booking->end_time > $startTime) ||
                    ($booking->start_time >= $startTime && $booking->start_time < $endTime)
                );
            })->isNotEmpty();

            if ($conflict) {
                return response()->json([
                    'message' => "Time range $startTime - $endTime on $dayOfWeek overlaps with existing bookings."
                ], 409);
            }
        }

        // Step 3: Clear and save new availability if no conflicts
        TeamAvailability::where('team_id', $team->id)->delete();

        foreach ($request->availability as $slot) {
            TeamAvailability::create([
                'team_id'     => $team->id,
                'day_of_week' => $slot['day_of_week'],
                'start_time'  => $slot['start_time'],
                'end_time'    => $slot['end_time'],
            ]);
        }

        return response()->json(['message' => 'Availability set.']);
    }


    public function generateSlots(Request $request, $id)
    {
        $request->validate([
            'from' => 'required|date',
            'to'   => 'required|date|after_or_equal:from',
        ]);

        $team = Team::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);

        $availability = TeamAvailability::where('team_id', $team->id)
            ->get()
            ->groupBy('day_of_week');

        $bookings = Booking::where('team_id', $team->id)
            ->whereBetween('date', [$request->from, $request->to])
            ->get();

        $slots = [];

        $period = CarbonPeriod::create($request->from, $request->to);
        foreach ($period as $date) {
            $day = $date->format('l'); // 'Monday', 'Tuesday', etc.

            if (! isset($availability[$day])) continue;

            foreach ($availability[$day] as $range) {
                $start = Carbon::parse($date->format('Y-m-d') . ' ' . $range->start_time);
                $end   = Carbon::parse($date->format('Y-m-d') . ' ' . $range->end_time);

                while ($start->copy()->addHour() <= $end) {
                    $slotStart = $start->format('H:i');
                    $slotEnd   = $start->copy()->addHour()->format('H:i');

                    $conflict = $bookings->contains(function ($booking) use ($date, $slotStart, $slotEnd) {
                        return $booking->date === $date->toDateString() &&
                            (
                                ($booking->start_time < $slotEnd && $booking->end_time > $slotStart)
                            );
                    });

                    if (! $conflict) {
                        $slots[] = [
                            'date'       => $date->toDateString(),
                            'start_time' => $slotStart,
                            'end_time'   => $slotEnd
                        ];
                    }

                    $start->addHour();
                }
            }
        }

        return response()->json(['slots' => $slots]);
    }
}
