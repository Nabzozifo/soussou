<?php

namespace App\Http\Controllers;

use App\Models\UserProgress;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    /**
     * Obtenir la progression de l'utilisateur
     */
    public function getProgress(Request $request)
    {
        $progress = $request->user()->progress;

        if (!$progress) {
            // Créer un profil de progression s'il n'existe pas
            $progress = UserProgress::create([
                'user_id' => $request->user()->id,
            ]);
        }

        return response()->json([
            'progress' => $progress,
            'success_rate' => $progress->getSuccessRate(),
        ]);
    }

    /**
     * Obtenir le tableau de bord avec statistiques détaillées
     */
    public function getDashboard(Request $request)
    {
        $user = $request->user();
        $progress = $user->progress;

        $recentSessions = $user->gameSessions()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $statsByMode = $user->gameSessions()
            ->selectRaw('game_mode, COUNT(*) as count, AVG(score) as avg_score, SUM(time_spent) as total_time')
            ->groupBy('game_mode')
            ->get();

        $statsByDifficulty = $user->gameSessions()
            ->selectRaw('difficulty, COUNT(*) as count, AVG(score) as avg_score')
            ->groupBy('difficulty')
            ->get();

        return response()->json([
            'progress' => $progress,
            'success_rate' => $progress->getSuccessRate(),
            'recent_sessions' => $recentSessions,
            'stats_by_mode' => $statsByMode,
            'stats_by_difficulty' => $statsByDifficulty,
        ]);
    }

    /**
     * Mettre à jour la difficulté préférée
     */
    public function updateDifficulty(Request $request)
    {
        $request->validate([
            'difficulty' => 'required|in:easy,medium,hard',
        ]);

        $progress = $request->user()->progress;
        $progress->current_difficulty = $request->difficulty;
        $progress->save();

        return response()->json([
            'progress' => $progress,
            'message' => 'Difficulté mise à jour',
        ]);
    }

    /**
     * Ajouter un accomplissement
     */
    public function addAchievement(Request $request)
    {
        $request->validate([
            'achievement' => 'required|string',
        ]);

        $progress = $request->user()->progress;
        $achievements = $progress->achievements ?? [];

        if (!in_array($request->achievement, $achievements)) {
            $achievements[] = [
                'name' => $request->achievement,
                'unlocked_at' => now(),
            ];
            $progress->achievements = $achievements;
            $progress->save();
        }

        return response()->json([
            'progress' => $progress,
            'message' => 'Accomplissement ajouté',
        ]);
    }

    /**
     * Réinitialiser la progression
     */
    public function resetProgress(Request $request)
    {
        $progress = $request->user()->progress;

        $progress->update([
            'total_score' => 0,
            'games_played' => 0,
            'correct_answers' => 0,
            'wrong_answers' => 0,
            'best_streak' => 0,
            'total_time_spent' => 0,
            'achievements' => [],
            'game_stats' => [],
        ]);

        // Supprimer toutes les sessions
        $request->user()->gameSessions()->delete();

        return response()->json([
            'message' => 'Progression réinitialisée',
            'progress' => $progress,
        ]);
    }

    /**
     * Obtenir le classement (leaderboard)
     */
    public function getLeaderboard(Request $request)
    {
        $limit = $request->get('limit', 10);
        $period = $request->get('period', 'all'); // all, week, month

        $query = UserProgress::with('user:id,name')
            ->orderBy('total_score', 'desc');

        if ($period === 'week') {
            $query->whereHas('user.gameSessions', function ($q) {
                $q->where('created_at', '>=', now()->subWeek());
            });
        } elseif ($period === 'month') {
            $query->whereHas('user.gameSessions', function ($q) {
                $q->where('created_at', '>=', now()->subMonth());
            });
        }

        $leaderboard = $query->limit($limit)->get();

        return response()->json([
            'leaderboard' => $leaderboard,
            'period' => $period,
        ]);
    }
}
