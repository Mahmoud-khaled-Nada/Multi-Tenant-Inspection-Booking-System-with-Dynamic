<?php

namespace Modules\Teams\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Teams\Models\Team;

class TeamsController extends Controller
{
     public function index(Request $request)
    {
        $teams = Team::where('tenant_id', $request->user()->tenant_id)->get();

        return response()->json(['teams' => $teams]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $team = Team::create([
            'tenant_id' => $request->user()->tenant_id,
            'name' => $request->name,
        ]);

        return response()->json(['team' => $team], 201);
    }
}
