<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Order::with(['business', 'deliveryUser', 'items']);

        if ($user && $user->role === 'delivery') {
            // Delivery driver sees available pending/accepted orders and orders assigned to them
            $query->where(function ($q) use ($user) {
                $q->whereNull('delivery_user_id')
                    ->whereIn('status', ['pending', 'accepted'])
                    ->orWhere('delivery_user_id', $user->id);
            });
        } elseif ($user && $user->role === 'provider') {
            // Provider sees orders for their business
            $businessIds = $user->businesses->pluck('id');
            $query->whereIn('business_id', $businessIds);
        } elseif ($user && $user->role === 'client') {
            $query->where('user_id', $user->id);
        }

        $status = $request->query('status');
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $orders = $query->latest('id')->get()->map(function ($order) {
            return $this->formatOrder($order);
        });

        return response()->json($orders);
    }

    /**
     * Store a newly created order from the cart checkout.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'businessId' => 'nullable',
            'customerName' => 'required|string|max:150',
            'customerPhone' => 'required|string|max:30',
            'customerAddress' => 'required|string|max:255',
            'notes' => 'nullable|string|max:500',
            'paymentMethod' => 'nullable|string|max:50',
            'subtotal' => 'required|numeric|min:0',
            'deliveryFee' => 'nullable|numeric|min:0',
            'totalAmount' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.productId' => 'nullable',
        ]);

        $orderNumber = 'ORD-'.date('Ymd').'-'.strtoupper(Str::random(5));
        $user = $request->user();

        // Resolve numeric business ID if possible
        $businessId = null;
        if (! empty($validated['businessId'])) {
            $parsedId = is_numeric($validated['businessId'])
                ? $validated['businessId']
                : (Business::where('name', 'like', "%{$validated['businessId']}%")->value('id'));
            $businessId = $parsedId;
        }

        $order = Order::create([
            'order_number' => $orderNumber,
            'user_id' => $user?->id,
            'business_id' => $businessId,
            'customer_name' => $validated['customerName'],
            'customer_phone' => $validated['customerPhone'],
            'customer_address' => $validated['customerAddress'],
            'notes' => $validated['notes'] ?? null,
            'payment_method' => $validated['paymentMethod'] ?? 'efectivo',
            'subtotal' => $validated['subtotal'],
            'delivery_fee' => $validated['deliveryFee'] ?? 4000,
            'total_amount' => $validated['totalAmount'],
            'status' => 'pending',
        ]);

        foreach ($validated['items'] as $item) {
            $itemSubtotal = $item['price'] * $item['quantity'];
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => ! empty($item['productId']) && is_numeric($item['productId']) ? $item['productId'] : null,
                'product_name' => $item['name'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'subtotal' => $itemSubtotal,
            ]);
        }

        $order->load(['business', 'items']);

        return response()->json([
            'message' => '¡Pedido realizado exitosamente!',
            'order' => $this->formatOrder($order),
        ], 201);
    }

    /**
     * Update order status (e.g., accepted, in_transit, delivered).
     */
    public function updateStatus(Request $request, string|int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,accepted,in_transit,delivered,cancelled',
            'assignToMe' => 'nullable|boolean',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $validated['status'];

        $user = $request->user();
        if ($request->boolean('assignToMe') && $user && $user->role === 'delivery') {
            $order->delivery_user_id = $user->id;
        }

        $order->save();
        $order->load(['business', 'deliveryUser', 'items']);

        return response()->json([
            'message' => 'Estado del pedido actualizado',
            'order' => $this->formatOrder($order),
        ]);
    }

    /**
     * Format an order response for the frontend.
     */
    private function formatOrder(Order $order): array
    {
        return [
            'id' => (string) $order->id,
            'orderNumber' => $order->order_number,
            'businessName' => $order->business?->name ?? 'Comercio Local Yaguará',
            'businessPhone' => $order->business?->phone ?? '314 461 8379',
            'customerName' => $order->customer_name,
            'customerPhone' => $order->customer_phone,
            'customerAddress' => $order->customer_address,
            'notes' => $order->notes,
            'paymentMethod' => $order->payment_method,
            'subtotal' => (float) $order->subtotal,
            'deliveryFee' => (float) $order->delivery_fee,
            'totalAmount' => (float) $order->total_amount,
            'status' => $order->status,
            'deliveryUser' => $order->deliveryUser ? [
                'id' => $order->deliveryUser->id,
                'name' => $order->deliveryUser->name,
                'phone' => $order->deliveryUser->phone,
                'vehicle' => $order->deliveryUser->vehicle,
            ] : null,
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->product_name,
                    'price' => (float) $item->price,
                    'quantity' => $item->quantity,
                    'subtotal' => (float) $item->subtotal,
                ];
            }),
            'createdAt' => $order->created_at?->toISOString(),
        ];
    }
}
