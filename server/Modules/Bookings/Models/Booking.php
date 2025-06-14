<?php

namespace Modules\Bookings\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'tenant_id', 'user_id', 'team_id', 'date', 'start_time', 'end_time'
    ];

    public function user()
    {
        return $this->belongsTo(\Modules\Users\Models\User::class);
    }

    public function team()
    {
        return $this->belongsTo(\Modules\Teams\Models\Team::class);
    }
}