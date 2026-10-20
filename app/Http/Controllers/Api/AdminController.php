<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get platform metrics and summary for Admin Dashboard.
     */
    public function stats(): JsonResponse
    {
        $activeProvidersCount = Business::where('verified', true)->count();
        $pendingVerificationsCount = Business::where('verification_status', 'pending')->count();
        $totalOrdersCount = Order::count();
        $totalUsersCount = User::count();
        $totalVolume = Order::where('status', 'delivered')->sum('total_amount');
        $commissionEarned = $totalVolume * 0.05; // 5% commission model

        return response()->json([
            'activeProvidersCount' => $activeProvidersCount,
            'pendingVerificationsCount' => $pendingVerificationsCount,
            'totalOrdersCount' => $totalOrdersCount,
            'totalUsersCount' => $totalUsersCount,
            'totalVolume' => (float) $totalVolume,
            'commissionEarned' => (float) $commissionEarned,
        ]);
    }

    /**
     * List all pending or historical verifications for KYC review.
     */
    public function verifications(Request $request): JsonResponse
    {
        $status = $request->query('status', 'all');

        $query = Business::with(['category', 'user']);

        if ($status !== 'all') {
            $query->where('verification_status', $status);
        }

        $verifications = $query->latest('id')->get()->map(function ($b) {
            return [
                'id' => 'ver_'.$b->id,
                'providerId' => (string) $b->id,
                'businessName' => $b->name,
                'applicantName' => $b->owner_name ?? ($b->user?->name ?? 'Propietario'),
                'categoryId' => $b->category_id,
                'categoryName' => $b->category?->label ?? 'General',
                'municipality' => $b->location ?? 'Yaguará',
                'documentType' => $b->document_type ?? 'Cédula / NIT',
                'documentNumber' => $b->document_number ?? ($b->nit ?? 'No registrado'),
                'submittedAt' => $b->created_at?->toISOString() ?? now()->toISOString(),
                'status' => $b->verification_status ?? ($b->verified ? 'approved' : 'pending'),
                'idFrontUrl' => $b->id_front_url,
                'rutDocUrl' => $b->rut_doc_url,
                'notes' => $b->admin_notes,
            ];
        });

        return response()->json($verifications);
    }

    /**
     * Approve or reject a business verification.
     */
    public function updateVerification(Request $request, string|int $id): JsonResponse
    {
        // Handle IDs passed as 'ver_12' or '12'
        $numericId = str_replace('ver_', '', (string) $id);

        $business = Business::find($numericId);

        if (! $business) {
            return response()->json(['message' => 'Negocio no encontrado'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:approved,rejected,pending,on_hold',
            'notes' => 'nullable|string|max:500',
        ]);

        $status = $validated['status'];
        $business->verification_status = $status;
        $business->verified = ($status === 'approved');
        if (isset($validated['notes'])) {
            $business->admin_notes = $validated['notes'];
        }
        $business->save();

        return response()->json([
            'message' => $status === 'approved' ? 'Negocio verificado con éxito' : 'Estado de verificación actualizado',
            'business' => [
                'id' => (string) $business->id,
                'verified' => (bool) $business->verified,
                'verification_status' => $business->verification_status,
                'notes' => $business->admin_notes,
            ],
        ]);
    }

    /**
     * List all users on the platform.
     */
    public function users(): JsonResponse
    {
        $users = User::withCount('businesses')->latest('id')->get();

        return response()->json($users);
    }
}
