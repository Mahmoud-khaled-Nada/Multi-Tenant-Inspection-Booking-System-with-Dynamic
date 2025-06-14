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

}
