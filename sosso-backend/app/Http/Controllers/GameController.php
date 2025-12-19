<?php

namespace App\Http\Controllers;

use App\Models\GameSession;
use App\Models\Number;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * Générer une série de questions pour un quiz
     */
    public function generateQuiz(Request $request)
    {
        $request->validate([
            'difficulty' => 'required|in:easy,medium,hard',
            'count' => 'integer|min:1|max:50',
        ]);

        $count = $request->get('count', 10);
        $difficulty = $request->difficulty;

        $numbers = Number::where('difficulty', $difficulty)
            ->inRandomOrder()
            ->limit($count)
            ->get();

        $questions = $numbers->map(function ($number) {
            // Générer des alternatives incorrectes
            $wrongAnswers = Number::where('id', '!=', $number->id)
                ->where('difficulty', $number->difficulty)
                ->inRandomOrder()
                ->limit(3)
                ->pluck('soussou_translation')
                ->toArray();

            $allAnswers = array_merge([$number->soussou_translation], $wrongAnswers);
            shuffle($allAnswers);

            return [
                'id' => $number->id,
                'number' => $number->number,
                'question' => "Quel est le nombre en soussou pour {$number->number} ?",
                'options' => $allAnswers,
                'correct_answer' => $number->soussou_translation,
            ];
        });

        return response()->json([
            'questions' => $questions,
            'difficulty' => $difficulty,
            'total' => $questions->count(),
        ]);
    }

    /**
     * Vérifier les réponses d'un quiz
     */
    public function checkQuiz(Request $request)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.*.number_id' => 'required|exists:numbers,id',
            'answers.*.user_answer' => 'required|string',
        ]);

        $results = [];
        $correctCount = 0;

        foreach ($request->answers as $answer) {
            $number = Number::find($answer['number_id']);
            $isCorrect = $number->isCorrectAnswer($answer['user_answer']);

            if ($isCorrect) {
                $correctCount++;
            }

            $results[] = [
                'number_id' => $number->id,
                'number' => $number->number,
                'user_answer' => $answer['user_answer'],
                'correct_answer' => $number->soussou_translation,
                'is_correct' => $isCorrect,
                'explanation' => $number->explanation,
            ];
        }

        $totalQuestions = count($request->answers);
        $score = round(($correctCount / $totalQuestions) * 100, 2);

        return response()->json([
            'results' => $results,
            'correct_count' => $correctCount,
            'total_questions' => $totalQuestions,
            'score' => $score,
        ]);
    }

    /**
     * Sauvegarder une session de jeu
     */
    public function saveSession(Request $request)
    {
        $request->validate([
            'game_mode' => 'required|string|in:exploration,qcm,challenge,lessons',
            'difficulty' => 'required|string|in:easy,medium,hard',
            'score' => 'required|integer|min:0',
            'correct_answers' => 'required|integer|min:0',
            'wrong_answers' => 'required|integer|min:0',
            'time_spent' => 'required|integer|min:0',
            'streak' => 'required|integer|min:0',
            'numbers_played' => 'nullable|array',
        ]);

        $session = GameSession::create([
            'user_id' => $request->user()->id,
            'game_mode' => $request->game_mode,
            'difficulty' => $request->difficulty,
            'score' => $request->score,
            'correct_answers' => $request->correct_answers,
            'wrong_answers' => $request->wrong_answers,
            'time_spent' => $request->time_spent,
            'streak' => $request->streak,
            'numbers_played' => $request->numbers_played,
        ]);

        // Mettre à jour la progression globale
        $progress = $request->user()->progress;
        if ($progress) {
            $progress->updateAfterGame($request->only([
                'score',
                'correct_answers',
                'wrong_answers',
                'time_spent',
                'streak',
            ]));
        }

        return response()->json([
            'session' => $session,
            'progress' => $progress,
            'message' => 'Session sauvegardée avec succès',
        ], 201);
    }

    /**
     * Obtenir l'historique des sessions
     */
    public function getSessions(Request $request)
    {
        $perPage = $request->get('per_page', 20);
        $gameMode = $request->get('game_mode');

        $query = GameSession::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc');

        if ($gameMode) {
            $query->where('game_mode', $gameMode);
        }

        $sessions = $query->paginate($perPage);

        return response()->json($sessions);
    }

    /**
     * Obtenir les statistiques globales
     */
    public function getGlobalStats(Request $request)
    {
        $stats = [
            'total_games' => GameSession::count(),
            'total_players' => GameSession::distinct('user_id')->count('user_id'),
            'avg_score' => GameSession::avg('score'),
            'best_streak' => GameSession::max('streak'),
            'most_played_mode' => GameSession::select('game_mode')
                ->groupBy('game_mode')
                ->orderByRaw('COUNT(*) DESC')
                ->first()
                ->game_mode ?? 'exploration',
        ];

        return response()->json($stats);
    }
}
