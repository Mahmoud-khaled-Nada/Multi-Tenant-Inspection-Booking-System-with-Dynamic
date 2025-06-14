<?php

namespace Modules\Users\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['name', 'email', 'password', 'tenant_id'];

    public function tenant()
    {
        return $this->belongsTo(\Modules\Tenants\Models\Tenant::class);
    }


    public function scopeRole($query, $role)
    {
        return $query->where('role', $role);
    }
}
