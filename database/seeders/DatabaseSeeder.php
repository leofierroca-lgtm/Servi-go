<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            ['id' => 'comidas_tipicas', 'label' => 'Comidas Típicas & Quesillos', 'icon' => 'Utensils'],
            ['id' => 'electricistas', 'label' => 'Electricistas', 'icon' => 'Zap'],
            ['id' => 'transporte', 'label' => 'Transporte', 'icon' => 'Truck'],
            ['id' => 'droguerias', 'label' => 'Droguerías', 'icon' => 'Pill'],
            ['id' => 'domicilios', 'label' => 'Domicilios', 'icon' => 'Bike'],
            ['id' => 'acarreos', 'label' => 'Acarreos y Mudanzas', 'icon' => 'Package'],
            ['id' => 'maestros', 'label' => 'Maestros de Obra', 'icon' => 'HardHat'],
            ['id' => 'tecnologia', 'label' => 'Tecnología y Telefonía', 'icon' => 'Smartphone'],
            ['id' => 'belleza', 'label' => 'Belleza y Estética', 'icon' => 'Scissors'],
        ]);

        DB::table('users')->insert([
            ['id' => 1, 'name' => 'Administrador Yaguará', 'email' => 'admin@servigo.com', 'password' => Hash::make('password'), 'role' => 'admin'],
            ['id' => 2, 'name' => 'Budaphone', 'email' => 'budaphone@servigo.com', 'password' => Hash::make('password'), 'role' => 'provider'],
            ['id' => 3, 'name' => 'Comercio 2', 'email' => 'comercio2@servigo.com', 'password' => Hash::make('password'), 'role' => 'provider'],
            ['id' => 4, 'name' => 'Comercio 3', 'email' => 'comercio3@servigo.com', 'password' => Hash::make('password'), 'role' => 'provider'],
            ['id' => 5, 'name' => 'Comercio 4', 'email' => 'comercio4@servigo.com', 'password' => Hash::make('password'), 'role' => 'provider'],
            ['id' => 6, 'name' => 'Comercio 5', 'email' => 'comercio5@servigo.com', 'password' => Hash::make('password'), 'role' => 'provider'],
            ['id' => 7, 'name' => 'Servicio Uñas', 'email' => 'unas@servigo.com', 'password' => Hash::make('password'), 'role' => 'provider'],
        ]);

        DB::table('businesses')->insert([
            ['id' => 1, 'user_id' => 2, 'category_id' => 'tecnologia', 'name' => 'Budaphone', 'type' => 'commerce', 'description' => 'Servicio Técnico Especializado y Accesorios Móviles. Diagnóstico en 24 horas. Repara con nosotros es muy fácil!', 'location' => 'Yaguará', 'phone' => '3144618379', 'verified' => 1, 'image_banner' => 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&q=80&w=400'],
            ['id' => 2, 'user_id' => 3, 'category_id' => 'comidas_tipicas', 'name' => 'Comercio 2 (Pendiente)', 'type' => 'commerce', 'description' => 'Espacio reservado para el comercio 2.', 'location' => 'Yaguará', 'phone' => '', 'verified' => 0, 'image_banner' => null],
            ['id' => 3, 'user_id' => 4, 'category_id' => 'droguerias', 'name' => 'Comercio 3 (Pendiente)', 'type' => 'commerce', 'description' => 'Espacio reservado para el comercio 3.', 'location' => 'Yaguará', 'phone' => '', 'verified' => 0, 'image_banner' => null],
            ['id' => 4, 'user_id' => 5, 'category_id' => 'acarreos', 'name' => 'Comercio 4 (Pendiente)', 'type' => 'commerce', 'description' => 'Espacio reservado para el comercio 4.', 'location' => 'Yaguará', 'phone' => '', 'verified' => 0, 'image_banner' => null],
            ['id' => 5, 'user_id' => 6, 'category_id' => 'domicilios', 'name' => 'Comercio 5 (Pendiente)', 'type' => 'commerce', 'description' => 'Espacio reservado para el comercio 5.', 'location' => 'Yaguará', 'phone' => '', 'verified' => 0, 'image_banner' => null],
            ['id' => 6, 'user_id' => 7, 'category_id' => 'belleza', 'name' => 'Servicio de Maquillaje de Uñas (Pendiente)', 'type' => 'service', 'description' => 'Espacio reservado para el servicio de uñas y demás.', 'location' => 'Yaguará', 'phone' => '', 'verified' => 0, 'image_banner' => null],
        ]);

        DB::table('products')->insert([
            ['id' => 1, 'business_id' => 1, 'name' => 'Diagnóstico de Celular', 'description' => 'Diagnóstico en 24 horas', 'price' => 10000.00, 'unit' => 'servicio'],
            ['id' => 2, 'business_id' => 1, 'name' => 'Accesorios para Celulares', 'description' => 'Cables, cargadores, audífonos', 'price' => 15000.00, 'unit' => 'unidad'],
        ]);
    }
}
