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
        Schema::create('alphabet', function (Blueprint $table) {
            $table->id();
            $table->string('letter');
            $table->string('upper')->nullable();
            $table->string('lower')->nullable();
            $table->string('ipa')->nullable();
            $table->string('type'); // vowel, consonant, digraph, tone
            $table->string('category')->nullable(); // short, long, nasal for vowels
            $table->text('description')->nullable();
            $table->json('examples')->nullable();
            $table->string('orthography')->default('post1988'); // post1988, pre1988
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alphabet');
    }
};
