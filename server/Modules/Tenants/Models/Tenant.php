<?php

namespace Modules\Tenants\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Multitenancy\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant
{
    use HasFactory;

    protected $fillable = [ 'name', 'domain' ];

    public function users()
    {
        return $this->hasOne(\Modules\Users\Models\User::class);
    }

}


