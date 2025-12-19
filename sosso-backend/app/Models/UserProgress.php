<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProgress extends Model
{
    use HasFactory;

    protected $table = 'user_progress';

    protected $fillable = [
        'user_id',
        'total_score',
        'games_played',
        'correct_answers',
        'wrong_answers',
        'best_streak',
        'total_time_spent',
        'current_difficulty',
        'achievements',
        'game_stats',
    ];

    protected function casts(): array
    {
        return [
            'achievements' => 'array',
            'game_stats' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mettre à jour les stats après une session de jeu
     */
    public function updateAfterGame(array $gameData): void
    {
        $this->total_score += $gameData['score'] ?? 0;
        $this->games_played += 1;
        $this->correct_answers += $gameData['correct_answers'] ?? 0;
        $this->wrong_answers += $gameData['wrong_answers'] ?? 0;
        $this->total_time_spent += $gameData['time_spent'] ?? 0;

        if (isset($gameData['streak']) && $gameData['streak'] > $this->best_streak) {
            $this->best_streak = $gameData['streak'];
        }

        $this->save();
    }

    /**
     * Obtenir le taux de réussite
     */
    public function getSuccessRate(): float
    {
        $total = $this->correct_answers + $this->wrong_answers;
        return $total > 0 ? round(($this->correct_answers / $total) * 100, 2) : 0;
    }
}
