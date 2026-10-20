<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BusinessController extends Controller
{
    /**
     * Display a listing of businesses with filtering and search.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Business::with(['category', 'products', 'user']);

        if ($request->filled('type') && $request->type !== 'all') {
            $type = $request->type;
            if (in_array($type, ['services', 'service'])) {
                $query->where('type', 'service');
            } elseif (in_array($type, ['commerce', 'comercios', 'comercio'])) {
                $query->where('type', 'commerce');
            } else {
                $query->where('type', $type);
            }
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }

        if ($request->boolean('only_verified')) {
            $query->where('verified', true);
        }

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $businesses = $query->latest('id')->get()->map(function ($b) {
            return $this->formatBusiness($b);
        });

        return response()->json($businesses);
    }

    /**
     * Display the specified business.
     */
    public function show(string|int $id): JsonResponse
    {
        $business = Business::with(['category', 'products', 'reviews.user', 'promotions'])
            ->where('id', $id)
            ->first();

        if (! $business) {
            return response()->json(['message' => 'Negocio no encontrado'], 404);
        }

        return response()->json($this->formatBusiness($business));
    }

    /**
     * Store a newly created business along with KYC documents and files.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'businessName' => 'required|string|max:150',
            'category' => 'required|string',
            'type' => 'nullable|string|in:service,commerce',
            'description' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:200',
            'phone' => 'nullable|string|max:30',
            'ownerName' => 'nullable|string|max:150',
            'email' => 'nullable|email|max:100',
            'nit' => 'nullable|string|max:50',
            'documentType' => 'nullable|string|max:50',
            'documentNumber' => 'nullable|string|max:50',
            'paymentMethods' => 'nullable',
            // File uploads
            'idFront' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'rutDoc' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'avatar' => 'nullable|file|mimes:jpeg,png,jpg|max:4096',
            'banner' => 'nullable|file|mimes:jpeg,png,jpg|max:6144',
        ]);

        // Resolve or create category
        $categoryKey = Str::slug($validated['category'], '_');
        $category = Category::find($categoryKey);
        if (! $category) {
            $category = Category::create([
                'id' => $categoryKey,
                'label' => $validated['category'],
                'icon' => 'Store',
            ]);
        }

        // Determine user
        $user = $request->user();
        if (! $user) {
            $email = $validated['email'] ?? 'contacto_'.time().'@servigo.com';
            $user = User::where('email', $email)->first();
            if (! $user) {
                $user = User::create([
                    'name' => $validated['ownerName'] ?? $validated['businessName'],
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'role' => 'provider',
                    'phone' => $validated['phone'] ?? null,
                    'address' => $validated['address'] ?? 'Yaguará',
                ]);
            }
        }

        // Handle file uploads directly into public/uploads for Laragon local serving
        $uploadsDir = public_path('uploads');
        if (! file_exists($uploadsDir)) {
            mkdir($uploadsDir, 0777, true);
        }

        $idFrontUrl = null;
        if ($request->hasFile('idFront')) {
            $file = $request->file('idFront');
            $fileName = 'media_id_'.time().'_'.Str::random(6).'.'.$file->getClientOriginalExtension();
            $file->move($uploadsDir, $fileName);
            $idFrontUrl = '/uploads/'.$fileName;
        }

        $rutDocUrl = null;
        if ($request->hasFile('rutDoc')) {
            $file = $request->file('rutDoc');
            $fileName = 'media_rut_'.time().'_'.Str::random(6).'.'.$file->getClientOriginalExtension();
            $file->move($uploadsDir, $fileName);
            $rutDocUrl = '/uploads/'.$fileName;
        }

        $avatarUrl = '/uploads/servigo-icon.png';
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $fileName = 'media_avatar_'.time().'_'.Str::random(6).'.'.$file->getClientOriginalExtension();
            $file->move($uploadsDir, $fileName);
            $avatarUrl = '/uploads/'.$fileName;
        }

        $bannerUrl = null;
        if ($request->hasFile('banner')) {
            $file = $request->file('banner');
            $fileName = 'media_banner_'.time().'_'.Str::random(6).'.'.$file->getClientOriginalExtension();
            $file->move($uploadsDir, $fileName);
            $bannerUrl = '/uploads/'.$fileName;
        }

        $paymentMethods = is_array($request->paymentMethods)
            ? $request->paymentMethods
            : (json_decode($request->paymentMethods, true) ?? ['efectivo']);

        $business = Business::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'name' => $validated['businessName'],
            'type' => $validated['type'] ?? 'commerce',
            'description' => $validated['description'] ?? 'Servicio local verificado en Yaguará.',
            'location' => $validated['location'] ?? 'Yaguará',
            'address' => $validated['address'] ?? 'Casco Urbano, Yaguará',
            'phone' => $validated['phone'] ?? null,
            'rating' => 5.00,
            'reviews_count' => 0,
            'response_time' => '100% resp. (~5 min)',
            'verified' => false,
            'verification_status' => 'pending',
            'nit' => $validated['nit'] ?? null,
            'owner_name' => $validated['ownerName'] ?? null,
            'document_type' => $validated['documentType'] ?? 'Cédula de Ciudadanía',
            'document_number' => $validated['documentNumber'] ?? null,
            'id_front_url' => $idFrontUrl,
            'rut_doc_url' => $rutDocUrl,
            'avatar' => $avatarUrl,
            'image_banner' => $bannerUrl,
            'payment_methods' => $paymentMethods,
        ]);

        return response()->json([
            'message' => '¡Negocio registrado exitosamente! Tu solicitud está en revisión de seguridad KYC.',
            'business' => $this->formatBusiness($business),
        ], 201);
    }

    /**
     * Helper to transform a business model to match the frontend expectations.
     */
    private function formatBusiness(Business $b): array
    {
        return [
            'id' => (string) $b->id,
            'name' => $b->name,
            'description' => $b->description,
            'category' => $b->category?->label ?? 'Comercio Local',
            'categoryId' => $b->category_id,
            'rating' => (string) ($b->rating ?? '5.0'),
            'reviews' => (int) ($b->reviews_count ?? count($b->reviews ?? [])),
            'location' => $b->location ?? 'Yaguará',
            'address' => $b->address ?? 'Yaguará, Huila',
            'phone' => $b->phone ?? '314 461 8379',
            'distance' => $b->distance ?? '0.5 km',
            'type' => $b->type,
            'verified' => (bool) $b->verified,
            'verification_status' => $b->verification_status ?? ($b->verified ? 'approved' : 'pending'),
            'responseTime' => $b->response_time ?? 'En minutos',
            'image' => $b->image_banner ?: ($b->avatar ?: '/uploads/food_factory_cover.jpg'),
            'bannerImage' => $b->image_banner,
            'avatar' => $b->avatar ?: '/uploads/servigo-icon.png',
            'highlights' => $b->highlights ?? [],
            'gallery' => $b->gallery ?? [],
            'products' => $b->products ?? [],
            'nit' => $b->nit,
            'ownerName' => $b->owner_name,
            'documentType' => $b->document_type,
            'documentNumber' => $b->document_number,
            'idFrontUrl' => $b->id_front_url,
            'rutDocUrl' => $b->rut_doc_url,
            'submittedAt' => $b->created_at?->toISOString(),
        ];
    }
}
