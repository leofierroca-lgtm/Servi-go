<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Categories
        $categories = [
            ['id' => 'comidas_rapidas', 'label' => 'Comidas Rápidas', 'icon' => 'Utensils'],
            ['id' => 'comidas_tipicas', 'label' => 'Comidas Típicas & Quesillos', 'icon' => 'Utensils'],
            ['id' => 'tecnologia', 'label' => 'Tecnología y Telefonía', 'icon' => 'Smartphone'],
            ['id' => 'belleza', 'label' => 'Belleza, Barbería & Spa', 'icon' => 'Scissors'],
            ['id' => 'hoteles', 'label' => 'Hoteles & Hospedaje', 'icon' => 'Hotel'],
            ['id' => 'supermercados', 'label' => 'Supermercados & Víveres', 'icon' => 'Store'],
            ['id' => 'ferreteria', 'label' => 'Ferretería & Construcción', 'icon' => 'HardHat'],
            ['id' => 'veterinaria', 'label' => 'Veterinaria & Mascotas', 'icon' => 'Sparkles'],
            ['id' => 'panaderias', 'label' => 'Panaderías & Pastelería', 'icon' => 'Coffee'],
            ['id' => 'transporte', 'label' => 'Transporte Público & Intermunicipal', 'icon' => 'Truck'],
            ['id' => 'droguerias', 'label' => 'Droguerías & Farmacias', 'icon' => 'Pill'],
            ['id' => 'domicilios', 'label' => 'Mensajería & Domicilios', 'icon' => 'Bike'],
            ['id' => 'acarreos', 'label' => 'Acarreos y Mudanzas', 'icon' => 'Package'],
            ['id' => 'electricistas', 'label' => 'Electricistas', 'icon' => 'Zap'],
            ['id' => 'maestros', 'label' => 'Maestros de Obra', 'icon' => 'HardHat'],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->updateOrInsert(['id' => $cat['id']], $cat);
        }

        // 2. Base Users (All with password: 'password')
        $users = [
            [
                'id' => 1,
                'name' => 'Administrador General',
                'email' => 'admin@servigo.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '300 000 0000',
                'address' => 'Sede Principal, Yaguará',
            ],
            [
                'id' => 2,
                'name' => 'Food Factory Propietario',
                'email' => 'proveedor@servigo.com',
                'password' => Hash::make('password'),
                'role' => 'provider',
                'phone' => '315 892 3456',
                'address' => 'Calle 6 # 3-15, Yaguará',
            ],
            [
                'id' => 3,
                'name' => 'Carlos Mendoza',
                'email' => 'cliente@servigo.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'phone' => '318 765 4321',
                'address' => 'Carrera 4 # 5-20, Centro, Yaguará',
            ],
            [
                'id' => 4,
                'name' => 'Juan Pérez (Domiciliario)',
                'email' => 'repartidor@servigo.com',
                'password' => Hash::make('password'),
                'role' => 'delivery',
                'phone' => '320 987 6543',
                'address' => 'Yaguará, Huila',
                'vehicle' => 'Moto Honda CB125',
                'plate' => 'ABC-12D',
            ],
            [
                'id' => 5,
                'name' => 'Budaphone Soporte',
                'email' => 'budaphone@servigo.com',
                'password' => Hash::make('password'),
                'role' => 'provider',
                'phone' => '314 461 8379',
                'address' => 'Parque Principal, Yaguará',
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->updateOrInsert(['id' => $user['id']], $user);
        }

        // 3. Businesses
        $businesses = [
            [
                'id' => 1,
                'user_id' => 2,
                'category_id' => 'comidas_rapidas',
                'name' => 'Food Factory',
                'type' => 'commerce',
                'description' => 'Las mejores hamburguesas artesanales de la ciudad, alitas BBQ y desgranados. ¡Pruébalas y no te arrepentirás!',
                'location' => 'Yaguará',
                'address' => 'Calle 4 # 6-22, Frente al Parque',
                'phone' => '315 892 3456',
                'rating' => 5.00,
                'reviews_count' => 42,
                'response_time' => '100% resp. (~5 min)',
                'verified' => true,
                'verification_status' => 'approved',
                'distance' => '0.2 km',
                'avatar' => '/uploads/food_factory_avatar.jpg',
                'image_banner' => '/uploads/food_factory_cover.jpg',
                'highlights' => json_encode(['Hamburguesas Artesanales', 'Domicilios Rápidos']),
            ],
            [
                'id' => 2,
                'user_id' => 5,
                'category_id' => 'tecnologia',
                'name' => 'Budaphone',
                'type' => 'commerce',
                'description' => 'Servicio Técnico Especializado y Accesorios Móviles. Diagnóstico en 24 horas. Venta de smartphones y computadores.',
                'location' => 'Yaguará',
                'address' => 'Carrera 5 # 4-18, Yaguará',
                'phone' => '314 461 8379',
                'rating' => 5.00,
                'reviews_count' => 120,
                'response_time' => '100% resp. (~5 min)',
                'verified' => true,
                'verification_status' => 'approved',
                'distance' => '0.5 km',
                'avatar' => '/uploads/media_1789657878799.png',
                'image_banner' => '/uploads/budaphone_cover.jpg',
                'highlights' => json_encode(['Diagnóstico 24h', 'Repuestos Originales']),
            ],
            [
                'id' => 3,
                'user_id' => 2,
                'category_id' => 'belleza',
                'name' => 'Josetovart Tatuajes & Arte',
                'type' => 'service',
                'description' => 'Estudio de tatuajes profesional. Diseños personalizados, alta higiene certificada y los mejores acabados artísticos.',
                'location' => 'Yaguará',
                'address' => 'Calle 5 # 3-40, Yaguará',
                'phone' => '312 455 7890',
                'rating' => 5.00,
                'reviews_count' => 15,
                'response_time' => '100% resp. (~10 min)',
                'verified' => true,
                'verification_status' => 'approved',
                'distance' => '0.3 km',
                'avatar' => '/uploads/tattoo_avatar.jpg',
                'image_banner' => '/uploads/tattoo_cover.jpg',
                'highlights' => json_encode(['Arte Único', 'Higiene 100%']),
            ],
            [
                'id' => 4,
                'user_id' => 2,
                'category_id' => 'comidas_tipicas',
                'name' => 'Asadero & Quesillos El Buen Sabor',
                'type' => 'commerce',
                'description' => 'Quesillo auténtico yaguareño en hoja de plátano, mojarra frita fresca de la represa de Betania y asado huilense tradicional.',
                'location' => 'Yaguará',
                'address' => 'Calle 6 # 3-15, Yaguará',
                'phone' => '310 987 6543',
                'rating' => 4.90,
                'reviews_count' => 88,
                'response_time' => '100% resp. (~5 min)',
                'verified' => true,
                'verification_status' => 'approved',
                'distance' => '0.4 km',
                'avatar' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
                'image_banner' => 'https://images.unsplash.com/photo-1544025162-836021cbce07?auto=format&fit=crop&q=80&w=400',
                'highlights' => json_encode(['Quesillo Típico', 'Mojarra Frita']),
            ],
            [
                'id' => 5,
                'user_id' => 2,
                'category_id' => 'hoteles',
                'name' => 'Hotel Chuira Yaguará',
                'type' => 'service',
                'description' => 'Hospedaje campestre y urbano con vista a los hermosos paisajes de Yaguará. Habitaciones con aire acondicionado y piscina.',
                'location' => 'Yaguará',
                'address' => 'Vía a la Represa, Km 1',
                'phone' => '311 234 5678',
                'rating' => 4.80,
                'reviews_count' => 34,
                'response_time' => '98% resp. (~15 min)',
                'verified' => true,
                'verification_status' => 'approved',
                'distance' => '1.2 km',
                'avatar' => '/uploads/hotel_chuira_banner.jpg',
                'image_banner' => '/uploads/hotel_chuira_fondo.jpg',
                'highlights' => json_encode(['Piscina', 'Aire Acondicionado']),
            ],
            [
                'id' => 6,
                'user_id' => 2,
                'category_id' => 'droguerias',
                'name' => 'Droguería La Principal Yaguará',
                'type' => 'commerce',
                'description' => 'Medicamentos de marca y genéricos, inyectología, toma de presión y productos de aseo personal con entrega a domicilio.',
                'location' => 'Yaguará',
                'address' => 'Carrera 4 # 4-02 Esquina',
                'phone' => '318 444 3322',
                'rating' => 4.95,
                'reviews_count' => 67,
                'response_time' => '100% resp. (~3 min)',
                'verified' => true,
                'verification_status' => 'approved',
                'distance' => '0.1 km',
                'avatar' => 'https://images.unsplash.com/photo-1584308666744-247e87faa08b?auto=format&fit=crop&q=80&w=400',
                'image_banner' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
                'highlights' => json_encode(['Domicilios 24h', 'Inyectología']),
            ],
            [
                'id' => 7,
                'user_id' => 2,
                'category_id' => 'comidas_tipicas',
                'name' => 'Asados El Gordo (Pendiente de Aprobación)',
                'type' => 'commerce',
                'description' => 'Deliciosos asados al carbón y carnes a la llanera. Solicitud enviada pendiente de aprobación por el administrador.',
                'location' => 'Yaguará',
                'address' => 'Calle 8 # 2-10',
                'phone' => '312 888 9900',
                'rating' => 5.00,
                'reviews_count' => 0,
                'response_time' => 'Pendiente',
                'verified' => false,
                'verification_status' => 'pending',
                'owner_name' => 'Juan Fernando Castro',
                'nit' => '1075333444',
                'document_type' => 'Cédula de Ciudadanía',
                'document_number' => '1075333444',
                'distance' => '0.8 km',
                'avatar' => '/uploads/servigo-icon.png',
                'image_banner' => null,
            ],
        ];

        foreach ($businesses as $b) {
            DB::table('businesses')->updateOrInsert(['id' => $b['id']], $b);
        }

        // 4. Products
        $products = [
            // Food Factory
            ['id' => 1, 'business_id' => 1, 'name' => 'Hamburguesa Especial Artesanal', 'description' => 'Carne 150g, queso cheddar fundido, tocineta ahumada, cebolla caramelizada y papas a la francesa.', 'price' => 18000.00, 'unit' => 'unidad', 'image' => '/uploads/food_factory_cover.jpg'],
            ['id' => 2, 'business_id' => 1, 'name' => 'Alitas BBQ x 12 Unidades', 'description' => 'Bañadas en salsa BBQ de la casa acompañadas de papas y salsa tártara.', 'price' => 26000.00, 'unit' => 'porción', 'image' => '/uploads/food_factory_banner.jpg'],
            ['id' => 3, 'business_id' => 1, 'name' => 'Desgranado Mixto', 'description' => 'Maíz tierno con pollo desmechado, carne desmechada, queso costeño rallado y ripio de papa.', 'price' => 22000.00, 'unit' => 'plato', 'image' => '/uploads/hamburguesa_fondo.jpg'],

            // Budaphone
            ['id' => 4, 'business_id' => 2, 'name' => 'iPhone 15 Pro (128GB)', 'description' => 'Cuerpo de titanio aeroespacial, chip A17 Pro y cámara con zoom 3x.', 'price' => 4500000.00, 'unit' => 'unidad', 'image' => '/uploads/tech_iphone.jpg'],
            ['id' => 5, 'business_id' => 2, 'name' => 'Samsung Galaxy S24 Ultra', 'description' => 'Galaxy AI integrada, pantalla Dynamic AMOLED 2X y cámara de 200MP.', 'price' => 5200000.00, 'unit' => 'unidad', 'image' => '/uploads/tech_samsung.jpg'],
            ['id' => 6, 'business_id' => 2, 'name' => 'MacBook Air M3 (8GB/256GB)', 'description' => 'Pantalla Liquid Retina de 13.6 pulgadas, chip M3, diseño ultraligero.', 'price' => 4800000.00, 'unit' => 'unidad', 'image' => '/uploads/tech_macbook.jpg'],
            ['id' => 7, 'business_id' => 2, 'name' => 'Diagnóstico Especializado de Celular', 'description' => 'Diagnóstico en 24 horas para equipos mojados, pantallas o fallas de placa.', 'price' => 10000.00, 'unit' => 'servicio', 'image' => '/uploads/media_1789652812023.jpg'],

            // Asadero & Quesillos
            ['id' => 8, 'business_id' => 4, 'name' => 'Quesillo Yaguareño en Hoja de Plátano (500g)', 'description' => 'Elaborado diariamente con leche entera fresca de fincas de Yaguará.', 'price' => 14000.00, 'unit' => 'unidad', 'image' => 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=600'],
            ['id' => 9, 'business_id' => 4, 'name' => 'Mojarra Frita Roja Gigante', 'description' => 'Acompañada de patacón pisao, arroz con coco y ensalada de la casa.', 'price' => 32000.00, 'unit' => 'plato', 'image' => 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600'],
            ['id' => 10, 'business_id' => 4, 'name' => 'Kumis Casero Tradicional (Litro)', 'description' => 'Kumis cremoso y espeso, receta de la abuela.', 'price' => 9000.00, 'unit' => 'litro', 'image' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600'],

            // Droguería
            ['id' => 11, 'business_id' => 6, 'name' => 'Kit Primeros Auxilios Familiar', 'description' => 'Gasas, vendas, alcohol antiséptico, curas y microporo.', 'price' => 25000.00, 'unit' => 'kit', 'image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400'],
            ['id' => 12, 'business_id' => 6, 'name' => 'Servicio de Inyectología a Domicilio', 'description' => 'Aplicación profesional de medicamentos intramusculares o intravenosos.', 'price' => 8000.00, 'unit' => 'servicio', 'image' => 'https://images.unsplash.com/photo-1532187863486-5644f5460971?auto=format&fit=crop&q=80&w=400'],
        ];

        foreach ($products as $p) {
            DB::table('products')->updateOrInsert(['id' => $p['id']], $p);
        }

        // 5. Active Promotion for Food Factory (Sponsored ad)
        DB::table('promotions')->updateOrInsert(
            ['id' => 1],
            [
                'business_id' => 1,
                'plan' => 'destacado_24h',
                'amount' => 10000.00,
                'duration_hours' => 24,
                'status' => 'active',
                'starts_at' => now(),
                'expires_at' => now()->addHours(24),
                'payment_reference' => 'WOMPI-SEEDED-001',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 6. Sample Initial Order for Delivery Driver test
        DB::table('orders')->updateOrInsert(
            ['id' => 1],
            [
                'order_number' => 'ORD-20261020-YAG01',
                'user_id' => 3, // Carlos Mendoza
                'business_id' => 1, // Food Factory
                'delivery_user_id' => 4, // Juan Pérez
                'customer_name' => 'Carlos Mendoza',
                'customer_phone' => '318 765 4321',
                'customer_address' => 'Carrera 4 # 5-20, Centro, Yaguará',
                'notes' => 'Tocar el timbre de la reja blanca',
                'payment_method' => 'efectivo',
                'subtotal' => 36000.00,
                'delivery_fee' => 4000.00,
                'total_amount' => 40000.00,
                'status' => 'in_transit',
                'created_at' => now()->subMinutes(15),
                'updated_at' => now()->subMinutes(5),
            ]
        );

        DB::table('order_items')->updateOrInsert(
            ['id' => 1],
            [
                'order_id' => 1,
                'product_id' => 1,
                'product_name' => 'Hamburguesa Especial Artesanal',
                'price' => 18000.00,
                'quantity' => 2,
                'subtotal' => 36000.00,
                'created_at' => now()->subMinutes(15),
                'updated_at' => now()->subMinutes(15),
            ]
        );
    }
}
