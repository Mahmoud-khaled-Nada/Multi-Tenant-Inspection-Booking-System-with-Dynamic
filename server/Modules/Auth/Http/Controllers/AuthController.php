<?php

declare(strict_types=1);

namespace Modules\Auth\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Auth\Http\Resources\LoginResponseResource;
use Modules\Tenants\Models\Tenant;
use Modules\Users\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'tenant_name' => 'required|string|unique:tenants,name',
            'name'        => 'required|string',
            'email'       => 'required|email|unique:users,email',
            'password'    => 'required|string|confirmed'
        ]);

        $tenant = Tenant::create(['name' => $request->tenant_name]);

        $user = User::create([
            'tenant_id' => $tenant->id,
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
        ]);

        return response()->json([
            'user'   => $user,
            'tenant' => $tenant,
            'token'  => $user->createToken('auth_token')->plainTextToken,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        $user->token = $user->createToken('auth_token')->plainTextToken;

        return new LoginResponseResource($user);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }
}
