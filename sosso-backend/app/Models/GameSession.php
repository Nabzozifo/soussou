<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'game_mode',
        'difficulty',
        'score',
        'correct_answers',
        'wrong_answers',
        'time_spent',
        'streak',
        'numbers_played',
    ];

    protected function casts(): array
    {
        return [
            'numbers_played' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
