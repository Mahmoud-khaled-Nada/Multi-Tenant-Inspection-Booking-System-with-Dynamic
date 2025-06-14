<?php

namespace Modules\Teams\Models;


use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['tenant_id', 'name', 'description'];

    public function ownerTenant()
    {
        return $this->belongsTo(\Modules\Tenants\Models\Tenant::class, 'tenant_id');
    }

    public function tenants()
    {
        return $this->belongsToMany(\Modules\Tenants\Models\Tenant::class, 'team_tenant');
    }

    public function members()
    {
        return $this->belongsToMany(\Modules\Users\Models\User::class);
    }

}
