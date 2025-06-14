<?php

declare(strict_types=1);

namespace Modules\Auth\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use Modules\Auth\Http\Resources\LoginResponseResource;
use Modules\Tenants\Models\Tenant;
use Modules\Users\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Cookie;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'tenant_name' => 'required|string|unique:tenants,name',
            'name'        => 'required|string',
            'email'       => 'required|email|unique:users,email',
            'password'    => 'required|string'
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

        if(!$user || !Hash::check($request->password, $user->password))
        {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        $accessToken  = $user->createToken('access_token')->plainTextToken;
        $refreshToken = Str::random(64);

        $user->refresh_token = hash('sha256', $refreshToken);
        $user->save();

        $user->access_token  = $accessToken;
        $user->refresh_token = $refreshToken;

        return new LoginResponseResource($user);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->header('refresh_token');

        if(!$refreshToken)
        {
            return response()->json(['message' => 'Missing refresh token'], 401);
        }

        $user = User::where('refresh_token', hash('sha256', $refreshToken))->first();

        if(!$user)
        {
            return response()->json(['message' => 'Invalid refresh token'], 403);
        }

        // Optional: revoke old tokens
        $user->tokens()->delete();

        $newAccessToken = $user->createToken('access_token')->plainTextToken;

        return response()->json([
            'access_token' => $newAccessToken,
            'token_type'   => 'Bearer'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }

    public function profile(Request $request)
    {
        $user = $request->user();
        return response()->json($this->formatUser($user));
    }


    private function formatUser($user): array
    {
        return [
            "user"   => [
                'id'         => $user->id,
                'tenant_id'  => $user->tenant_id,
                'name'       => $user->name,
                'email'      => $user->email,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'tenant' => $user->tenant

        ];
    }
}
