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
        Schema::create('numbers', function (Blueprint $table) {
            $table->id();
            $table->integer('number')->unique();
            $table->string('soussou_translation');
            $table->json('alternatives')->nullable(); // Traductions alternatives
            $table->text('explanation')->nullable(); // Explication de la construction
            $table->json('breakdown')->nullable(); // Décomposition du nombre
            $table->string('difficulty')->default('easy'); // easy, medium, hard
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('numbers');
    }
};
