<?php

namespace Modules\Bookings\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Bookings\Models\Booking;

class BookingsController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::where('user_id', $request->user()->id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->orderBy('date')
            ->get();

        return response()->json(['bookings' => $bookings]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'team_id' => 'required|exists:teams,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        // Conflict check
        $conflict = Booking::where('team_id', $request->team_id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->where('date', $request->date)
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                      ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                      ->orWhere(function ($q) use ($request) {
                          $q->where('start_time', '<', $request->start_time)
                            ->where('end_time', '>', $request->end_time);
                      });
            })
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'Time slot already booked'], 409);
        }

        $booking = Booking::create([
            'tenant_id' => $request->user()->tenant_id,
            'user_id' => $request->user()->id,
            'team_id' => $request->team_id,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        return response()->json(['booking' => $booking], 201);
    }

    public function destroy(Request $request, $id)
    {
        $booking = Booking::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking canceled']);
    }
}
