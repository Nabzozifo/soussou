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
        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('total_score')->default(0);
            $table->integer('games_played')->default(0);
            $table->integer('correct_answers')->default(0);
            $table->integer('wrong_answers')->default(0);
            $table->integer('best_streak')->default(0);
            $table->integer('total_time_spent')->default(0); // en secondes
            $table->string('current_difficulty')->default('easy');
            $table->json('achievements')->nullable(); // badges et accomplissements
            $table->json('game_stats')->nullable(); // statistiques par mode de jeu
            $table->timestamps();
        });

        Schema::create('game_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('game_mode'); // exploration, qcm, challenge, lessons
            $table->string('difficulty');
            $table->integer('score');
            $table->integer('correct_answers');
            $table->integer('wrong_answers');
            $table->integer('time_spent'); // en secondes
            $table->integer('streak');
            $table->json('numbers_played')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_sessions');
        Schema::dropIfExists('user_progress');
    }
};
