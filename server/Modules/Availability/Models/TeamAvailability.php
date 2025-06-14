<?php

namespace Modules\Availability\Models;

use Illuminate\Database\Eloquent\Model;

class TeamAvailability extends Model
{
    protected $fillable = ['team_id', 'day_of_week', 'start_time', 'end_time'];

    public function team()
    {
        return $this->belongsTo(\Modules\Teams\Models\Team::class);
    }
}