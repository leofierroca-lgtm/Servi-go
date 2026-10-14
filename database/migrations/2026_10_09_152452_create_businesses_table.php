<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('category_id', 50);
            $table->foreign('category_id')->references('id')->on('categories')->restrictOnDelete();
            $table->string('name', 150);
            $table->enum('type', ['service', 'commerce']);
            $table->text('description')->nullable();
            $table->string('location', 100)->default('Yaguará');
            $table->string('address', 200)->nullable();
            $table->string('phone', 20)->nullable();
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->integer('reviews_count')->default(0);
            $table->string('response_time', 50)->default('En minutos');
            $table->boolean('verified')->default(false);
            $table->string('avatar')->nullable();
            $table->string('image_banner')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};
