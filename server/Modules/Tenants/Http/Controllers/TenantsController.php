<?php

namespace Modules\Tenants\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Multitenancy\Models\Tenant;

class TenantsController extends Controller
{
  public function show(Request $request)
    {
        $tenant = Tenant::current();
        if (!$tenant) {
            return response()->json(['message' => 'No tenant found'], 404);
        }

        return response()->json([
            'tenant' => $tenant
        ]);
    }
}
