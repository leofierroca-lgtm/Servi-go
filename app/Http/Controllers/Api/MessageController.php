<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Get chat messages between current user and a business/contact.
     */
    public function index(Request $request): JsonResponse
    {
        $businessId = $request->query('business_id');
        $user = $request->user();

        $query = Message::with(['sender', 'receiver']);

        if ($businessId) {
            $query->where('business_id', $businessId);
        }

        if ($user) {
            $query->where(function ($q) use ($user) {
                $q->where('sender_id', $user->id)
                    ->orWhere('receiver_id', $user->id);
            });
        }

        $messages = $query->latest('id')->limit(50)->get()->reverse()->values();

        return response()->json($messages);
    }

    /**
     * Send a new chat message.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string|max:2000',
            'businessId' => 'nullable',
            'receiverId' => 'nullable|integer',
        ]);

        $user = $request->user();
        $senderId = $user ? $user->id : 1; // Default to client 1 if guest

        $businessId = null;
        if (! empty($validated['businessId'])) {
            $businessId = is_numeric($validated['businessId'])
                ? $validated['businessId']
                : Business::where('name', 'like', "%{$validated['businessId']}%")->value('id');
        }

        $receiverId = $validated['receiverId'] ?? null;
        if (! $receiverId && $businessId) {
            $business = Business::find($businessId);
            $receiverId = $business?->user_id ?? 1;
        }

        $message = Message::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId ?: 1,
            'business_id' => $businessId,
            'content' => $validated['content'],
            'is_read' => false,
        ]);

        $message->load(['sender', 'receiver']);

        return response()->json([
            'message' => 'Mensaje enviado',
            'data' => $message,
        ], 201);
    }
}
