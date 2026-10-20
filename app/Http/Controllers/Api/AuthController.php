<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user and generate a Sanctum access token.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|in:client,provider,delivery',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'vehicle' => 'nullable|string|max:100',
            'plate' => 'nullable|string|max:20',
        ]);

        $role = $validated['role'] ?? 'client';

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $role,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'vehicle' => $validated['vehicle'] ?? null,
            'plate' => $validated['plate'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user,
            'token' => $token,
            'role' => $user->role,
        ], 201);
    }

    /**
     * Authenticate user with credentials and issue a Sanctum token.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::with('businesses')->where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $primaryBusiness = $user->businesses->first();

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'address' => $user->address,
                'vehicle' => $user->vehicle,
                'plate' => $user->plate,
                'businessId' => $primaryBusiness ? $primaryBusiness->id : null,
            ],
            'token' => $token,
            'role' => $user->role,
        ]);
    }

    /**
     * Logout and revoke the active token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }

    /**
     * Get the authenticated user's profile and linked businesses.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('businesses');
        $primaryBusiness = $user->businesses->first();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'address' => $user->address,
                'vehicle' => $user->vehicle,
                'plate' => $user->plate,
                'businessId' => $primaryBusiness ? $primaryBusiness->id : null,
            ],
            'role' => $user->role,
        ]);
    }
}
