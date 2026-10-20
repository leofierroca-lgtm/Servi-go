<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Expand users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 30)->default('client')->change();
            if (! Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 30)->nullable()->after('email');
            }
            if (! Schema::hasColumn('users', 'address')) {
                $table->string('address', 255)->nullable()->after('phone');
            }
            if (! Schema::hasColumn('users', 'vehicle')) {
                $table->string('vehicle', 100)->nullable()->after('address');
            }
            if (! Schema::hasColumn('users', 'plate')) {
                $table->string('plate', 20)->nullable()->after('vehicle');
            }
        });

        // 2. Expand businesses table
        Schema::table('businesses', function (Blueprint $table) {
            if (! Schema::hasColumn('businesses', 'nit')) {
                $table->string('nit', 50)->nullable()->after('name');
            }
            if (! Schema::hasColumn('businesses', 'owner_name')) {
                $table->string('owner_name', 150)->nullable()->after('nit');
            }
            if (! Schema::hasColumn('businesses', 'document_type')) {
                $table->string('document_type', 50)->nullable()->after('owner_name');
            }
            if (! Schema::hasColumn('businesses', 'document_number')) {
                $table->string('document_number', 50)->nullable()->after('document_type');
            }
            if (! Schema::hasColumn('businesses', 'id_front_url')) {
                $table->string('id_front_url', 255)->nullable()->after('document_number');
            }
            if (! Schema::hasColumn('businesses', 'rut_doc_url')) {
                $table->string('rut_doc_url', 255)->nullable()->after('id_front_url');
            }
            if (! Schema::hasColumn('businesses', 'verification_status')) {
                $table->string('verification_status', 30)->default('pending')->after('verified');
            }
            if (! Schema::hasColumn('businesses', 'highlights')) {
                $table->json('highlights')->nullable()->after('verification_status');
            }
            if (! Schema::hasColumn('businesses', 'gallery')) {
                $table->json('gallery')->nullable()->after('highlights');
            }
            if (! Schema::hasColumn('businesses', 'distance')) {
                $table->string('distance', 30)->default('0.5 km')->after('location');
            }
            if (! Schema::hasColumn('businesses', 'payment_methods')) {
                $table->json('payment_methods')->nullable()->after('gallery');
            }
            if (! Schema::hasColumn('businesses', 'admin_notes')) {
                $table->text('admin_notes')->nullable()->after('payment_methods');
            }
        });

        // 3. Create orders table
        if (! Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->string('order_number', 50)->unique();
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
                $table->foreignId('business_id')->nullable()->constrained()->nullOnDelete();
                $table->foreignId('delivery_user_id')->nullable()->references('id')->on('users')->nullOnDelete();
                $table->string('customer_name', 150);
                $table->string('customer_phone', 30);
                $table->string('customer_address', 255);
                $table->text('notes')->nullable();
                $table->string('payment_method', 50)->default('efectivo');
                $table->decimal('subtotal', 12, 2)->default(0);
                $table->decimal('delivery_fee', 12, 2)->default(4000);
                $table->decimal('total_amount', 12, 2)->default(0);
                $table->string('status', 30)->default('pending'); // pending, accepted, in_transit, delivered, cancelled
                $table->timestamps();
            });
        }

        // 4. Create order_items table
        if (! Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained()->cascadeOnDelete();
                $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
                $table->string('product_name', 150);
                $table->decimal('price', 12, 2);
                $table->integer('quantity')->default(1);
                $table->decimal('subtotal', 12, 2);
                $table->timestamps();
            });
        }

        // 5. Create promotions table
        if (! Schema::hasTable('promotions')) {
            Schema::create('promotions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('business_id')->constrained()->cascadeOnDelete();
                $table->string('plan', 50)->default('destacado_24h');
                $table->decimal('amount', 12, 2)->default(10000);
                $table->integer('duration_hours')->default(24);
                $table->string('status', 30)->default('active'); // pending, active, expired
                $table->timestamp('starts_at')->nullable();
                $table->timestamp('expires_at')->nullable();
                $table->string('payment_reference', 100)->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');

        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn([
                'nit', 'owner_name', 'document_type', 'document_number',
                'id_front_url', 'rut_doc_url', 'verification_status',
                'highlights', 'gallery', 'distance', 'payment_methods', 'admin_notes',
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'address', 'vehicle', 'plate']);
        });
    }
};
