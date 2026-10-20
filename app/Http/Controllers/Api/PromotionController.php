<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Promotion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    /**
     * Get active banner ads: Paid promotions first, followed by premier verified businesses.
     */
    public function bannerAds(): JsonResponse
    {
        // 1. Fetch active paid promotions
        $activePromos = Promotion::with('business.category')
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->latest('id')
            ->get();

        $ads = [];

        foreach ($activePromos as $promo) {
            $b = $promo->business;
            if (! $b) {
                continue;
            }

            $ads[] = [
                'id' => (string) $b->id,
                'name' => $b->name,
                'category' => $b->category?->label ?? 'Comercio Local',
                'description' => $b->description,
                'image' => $b->image_banner ?: ($b->avatar ?: '/uploads/food_factory_cover.jpg'),
                'avatar' => $b->avatar ?: $b->image_banner,
                'rating' => (string) ($b->rating ?? '5.0'),
                'isPaid' => true,
                'badge' => '⭐ Patrocinado',
                'plan' => $promo->plan,
            ];
        }

        // 2. Fetch premier verified businesses
        $verifiedBusinesses = Business::with('category')
            ->where('verified', true)
            ->whereNotIn('id', $activePromos->pluck('business_id'))
            ->get();

        foreach ($verifiedBusinesses as $b) {
            $ads[] = [
                'id' => (string) $b->id,
                'name' => $b->name,
                'category' => $b->category?->label ?? 'Comercio Local',
                'description' => $b->description,
                'image' => $b->image_banner ?: ($b->avatar ?: '/uploads/food_factory_cover.jpg'),
                'avatar' => $b->avatar ?: $b->image_banner,
                'rating' => (string) ($b->rating ?? '5.0'),
                'isPaid' => false,
                'badge' => 'Verificado',
            ];
        }

        return response()->json($ads);
    }

    /**
     * Purchase and activate an ad promotion banner (e.g. 10.000 COP for 24h).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'businessId' => 'required',
            'plan' => 'nullable|string',
            'amount' => 'nullable|numeric|min:0',
            'durationHours' => 'nullable|integer|min:1',
            'paymentReference' => 'nullable|string',
        ]);

        $businessId = is_numeric($validated['businessId'])
            ? $validated['businessId']
            : (Business::where('name', 'like', "%{$validated['businessId']}%")->value('id') ?? 1);

        $hours = $validated['durationHours'] ?? 24;
        $now = now();

        $promo = Promotion::create([
            'business_id' => $businessId,
            'plan' => $validated['plan'] ?? 'destacado_24h',
            'amount' => $validated['amount'] ?? 10000.00,
            'duration_hours' => $hours,
            'status' => 'active',
            'starts_at' => $now,
            'expires_at' => $now->copy()->addHours($hours),
            'payment_reference' => $validated['paymentReference'] ?? ('WOMPI-'.strtoupper(uniqid())),
        ]);

        return response()->json([
            'message' => '¡Pauta publicitaria activada con éxito por 24 horas!',
            'promotion' => $promo,
        ], 201);
    }
}
