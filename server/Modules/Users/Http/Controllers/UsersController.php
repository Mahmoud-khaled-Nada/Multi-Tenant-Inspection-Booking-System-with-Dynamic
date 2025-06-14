<?php

namespace Modules\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Users\Models\User;

class UsersController extends Controller
{

    public function index()
    {
        $users = User::all();
        return response()->json(['users' => $users]);
    }

    public function usersAnalysis()
    {
        $users = User::all();

        $counts = User::selectRaw("
        COUNT(*) as users_count,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
        SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) as manager_count,
        SUM(CASE WHEN role = 'inspector' THEN 1 ELSE 0 END) as inspector_count
    ")->first();

        return response()->json([
            'users'           => $users,
            'users_count'     => $counts->users_count,
            'admin_count'     => $counts->admin_count,
            'manager_count'   => $counts->manager_count,
            'inspector_count' => $counts->inspector_count,
        ]);
    }


}
