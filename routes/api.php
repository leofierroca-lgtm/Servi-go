<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\ReviewController;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes for Servi-Go (Directorio Digital Laravel)
|--------------------------------------------------------------------------
*/

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// Legacy sanctum user route
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Categories
Route::get('/categories', function () {
    return Category::all();
});

// Businesses
Route::get('/businesses', [BusinessController::class, 'index']);
Route::get('/businesses/{id}', [BusinessController::class, 'show']);
Route::post('/businesses', [BusinessController::class, 'store']);

// Promotions & Banners
Route::get('/banner-ads', [PromotionController::class, 'bannerAds']);
Route::post('/promotions', [PromotionController::class, 'store']);

// Orders (Cart & Delivery)
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

// Admin Management
Route::prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);
    Route::get('/verifications', [AdminController::class, 'verifications']);
    Route::put('/verifications/{id}', [AdminController::class, 'updateVerification']);
    Route::get('/users', [AdminController::class, 'users']);
});

// Chat & Messages
Route::get('/messages', [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store']);

// Reviews
Route::post('/reviews', [ReviewController::class, 'store']);
