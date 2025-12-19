<?php

namespace App\Http\Controllers;

use App\Models\Number;
use Illuminate\Http\Request;

class NumberController extends Controller
{
    /**
     * Obtenir un nombre aléatoire selon la difficulté
     */
    public function getRandom(Request $request)
    {
        $difficulty = $request->get('difficulty', 'easy');
        $direction = $request->get('direction', 'number-to-soussou');

        $query = Number::query();

        // Filtrer par difficulté
        if ($difficulty !== 'all') {
            $query->where('difficulty', $difficulty);
        }

        $number = $query->inRandomOrder()->first();

        if (!$number) {
            return response()->json([
                'error' => 'Aucun nombre trouvé',
            ], 404);
        }

        return response()->json([
            'number' => $number->number,
            'soussou' => $direction === 'number-to-soussou' ? null : $number->soussou_translation,
            'alternatives' => $number->alternatives,
            'difficulty' => $number->difficulty,
            'id' => $number->id,
        ]);
    }

    /**
     * Vérifier la réponse de l'utilisateur
     */
    public function checkAnswer(Request $request)
    {
        $request->validate([
            'number_id' => 'required|exists:numbers,id',
            'user_answer' => 'required|string',
        ]);

        $number = Number::findOrFail($request->number_id);
        $isCorrect = $number->isCorrectAnswer($request->user_answer);

        return response()->json([
            'correct' => $isCorrect,
            'correct_answer' => $number->soussou_translation,
            'alternatives' => $number->alternatives,
            'explanation' => $number->explanation,
        ]);
    }

    /**
     * Obtenir l'analyse détaillée d'un nombre
     */
    public function analyze(Request $request, $numberValue)
    {
        // Chercher par valeur du nombre (ex: 3556) au lieu de l'ID
        $number = Number::where('number', $numberValue)->first();

        if (!$number) {
            return response()->json([
                'error' => 'Nombre non trouvé dans la base de données',
                'number' => $numberValue
            ], 404);
        }

        return response()->json($number->getAnalysis());
    }

    /**
     * Obtenir un nombre par sa valeur
     */
    public function getByValue(Request $request, $value)
    {
        $number = Number::where('number', $value)->first();

        if (!$number) {
            return response()->json([
                'error' => 'Nombre non trouvé',
            ], 404);
        }

        return response()->json($number->getAnalysis());
    }

    /**
     * Obtenir tous les nombres (avec pagination)
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 50);
        $difficulty = $request->get('difficulty');

        $query = Number::query();

        if ($difficulty) {
            $query->where('difficulty', $difficulty);
        }

        $numbers = $query->orderBy('number')->paginate($perPage);

        return response()->json($numbers);
    }

    /**
     * Obtenir des nombres par plage
     */
    public function getRange(Request $request)
    {
        $request->validate([
            'min' => 'required|integer|min:0',
            'max' => 'required|integer|gt:min',
        ]);

        $numbers = Number::whereBetween('number', [$request->min, $request->max])
            ->orderBy('number')
            ->get();

        return response()->json($numbers);
    }
}
