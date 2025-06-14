<?php

namespace Modules\Teams\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Teams\Http\Resources\TeamsResponseResource;
use Modules\Teams\Models\Team;

class TeamsController extends Controller
{
    public function index(Request $request)
    {
        $teams = Team::with('tenants')
            ->where('tenant_id', $request->user()->tenant_id)
            ->get();

        return TeamsResponseResource::collection($teams);
    }

    public function find(Request $request, $teamId)
    {
        $team = Team::with('tenants')
            ->where('id', $teamId)
            ->first();
        return new TeamsResponseResource($team);
    }

    //

    public function findByTenant(Request $request, $tenant_id)
    {
        $team = Team::with('tenants')
            ->where('tenant_id', $tenant_id)
            ->first();

        return new TeamsResponseResource($team);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $team = Team::create([
            'tenant_id'   => $request->user()->tenant_id,
            'name'        => $request->name,
            'description' => $request->description
        ]);

        return response()->json(['team' => $team], 201);
    }


    public function assignTenants(Request $request, Team $team)
    {
        $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
        ]);

    $team->tenants()->syncWithoutDetaching($request->tenant_id);

        return response()->json([
            'message' => 'Tenants assigned to team successfully.',
            'team'    => $team->load('tenants')
        ]);

    }

}
