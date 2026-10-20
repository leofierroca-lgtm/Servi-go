<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Store a new rating/review for a business.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'businessId' => 'required',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $businessId = is_numeric($validated['businessId'])
            ? $validated['businessId']
            : (Business::where('name', 'like', "%{$validated['businessId']}%")->value('id'));

        $business = Business::findOrFail($businessId);
        $user = $request->user();

        $review = Review::create([
            'business_id' => $business->id,
            'user_id' => $user?->id ?? 1,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        // Recalculate average rating & reviews_count
        $avg = Review::where('business_id', $business->id)->avg('rating') ?: 5.0;
        $count = Review::where('business_id', $business->id)->count();

        $business->rating = round($avg, 2);
        $business->reviews_count = $count;
        $business->save();

        return response()->json([
            'message' => '¡Reseña publicada con éxito!',
            'review' => $review,
            'businessRating' => (string) $business->rating,
            'reviewsCount' => $business->reviews_count,
        ], 201);
    }
}
