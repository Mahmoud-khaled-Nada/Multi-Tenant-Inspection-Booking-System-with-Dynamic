<?php 

namespace Modules\Teams\Models;


use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['tenant_id', 'name'];

    public function tenant()
    {
        return $this->belongsTo(\Modules\Tenants\Models\Tenant::class);
    }
}