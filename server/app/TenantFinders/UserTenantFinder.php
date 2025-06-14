<?php


namespace App\TenantFinders;

use Illuminate\Http\Request;
use Modules\Tenants\Models\Tenant;
use Spatie\Multitenancy\TenantFinder\TenantFinder;

class UserTenantFinder extends TenantFinder
{
    public function findForRequest(Request $request): ?Tenant
    {
        return optional(auth('sanctum')->user())->tenant;
    }
}
