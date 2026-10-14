<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Business;
use App\Models\Category;
use App\Models\Product;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/categories', function () {
    return Category::all();
});

Route::get('/businesses', function (Request $request) {
    $query = Business::with(['category', 'products', 'user']);
    
    if ($request->has('type') && $request->type !== 'all') {
        $query->where('type', $request->type);
    }
    
    if ($request->has('category')) {
        $query->where('category_id', $request->category);
    }

    if ($request->has('search')) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    return $query->get();
});

Route::get('/businesses/{id}', function ($id) {
    return Business::with(['category', 'products', 'user', 'reviews'])->findOrFail($id);
});
