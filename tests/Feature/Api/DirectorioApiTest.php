<?php

namespace Tests\Feature\Api;

use App\Models\Business;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DirectorioApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_can_list_businesses_from_api(): void
    {
        $response = $this->getJson('/api/businesses');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'category',
                'categoryId',
                'rating',
                'type',
                'verified',
            ],
        ]);
    }

    public function test_can_fetch_single_business(): void
    {
        $business = Business::first();
        $this->assertNotNull($business, 'A business should exist in database');

        $response = $this->getJson("/api/businesses/{$business->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('name', $business->name);
    }

    public function test_can_login_user_and_receive_sanctum_token(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'cliente@servigo.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'user' => ['id', 'name', 'email', 'role'],
            'token',
        ]);
    }

    public function test_can_create_order_via_api(): void
    {
        $business = Business::first();

        $response = $this->postJson('/api/orders', [
            'businessId' => $business ? $business->id : 1,
            'customerName' => 'Carlos Mendoza',
            'customerPhone' => '318 765 4321',
            'customerAddress' => 'Carrera 4 # 5-20, Centro, Yaguará',
            'paymentMethod' => 'Efectivo',
            'subtotal' => 18000,
            'deliveryFee' => 4000,
            'totalAmount' => 22000,
            'items' => [
                [
                    'name' => 'Hamburguesa Especial Artesanal',
                    'price' => 18000,
                    'quantity' => 1,
                ],
            ],
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'order' => ['id', 'orderNumber', 'customerName', 'totalAmount', 'status'],
        ]);
    }

    public function test_admin_can_update_verification(): void
    {
        $business = Business::where('verification_status', 'pending')->first();
        if (! $business) {
            $business = Business::first();
        }

        $response = $this->putJson("/api/admin/verifications/{$business->id}", [
            'status' => 'approved',
            'notes' => 'Aprobado en test',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('business.verified', true);
        $response->assertJsonPath('business.verification_status', 'approved');
    }
}
