<?php

namespace App\Http\Controllers;

use App\Models\AlphabetLetter;
use Illuminate\Http\Request;

class AlphabetController extends Controller
{
    /**
     * Obtenir l'alphabet complet selon l'orthographe
     */
    public function index(Request $request)
    {
        $orthography = $request->get('orthography', 'post1988');
        $type = $request->get('type'); // vowel, consonant, digraph

        $query = AlphabetLetter::where('orthography', $orthography);

        if ($type) {
            $query->where('type', $type);
        }

        $letters = $query->orderBy('id')->get();

        return response()->json([
            'alphabet' => $letters,
            'orthography' => $orthography,
        ]);
    }

    /**
     * Obtenir les voyelles
     */
    public function getVowels(Request $request)
    {
        $orthography = $request->get('orthography', 'post1988');
        $category = $request->get('category'); // short, long, nasal

        $query = AlphabetLetter::where('orthography', $orthography)
            ->where('type', 'vowel');

        if ($category) {
            $query->where('category', $category);
        }

        $vowels = $query->get();

        return response()->json([
            'vowels' => $vowels,
            'orthography' => $orthography,
            'category' => $category,
        ]);
    }

    /**
     * Obtenir les consonnes
     */
    public function getConsonants(Request $request)
    {
        $orthography = $request->get('orthography', 'post1988');

        $consonants = AlphabetLetter::where('orthography', $orthography)
            ->where('type', 'consonant')
            ->get();

        return response()->json([
            'consonants' => $consonants,
            'orthography' => $orthography,
        ]);
    }

    /**
     * Obtenir les digraphes
     */
    public function getDigraphs(Request $request)
    {
        $orthography = $request->get('orthography', 'post1988');

        $digraphs = AlphabetLetter::where('orthography', $orthography)
            ->where('type', 'digraph')
            ->get();

        return response()->json([
            'digraphs' => $digraphs,
            'orthography' => $orthography,
        ]);
    }

    /**
     * Obtenir une lettre spécifique
     */
    public function show(Request $request, $id)
    {
        $letter = AlphabetLetter::findOrFail($id);

        return response()->json($letter);
    }

    /**
     * Générer un exercice de correspondance alphabet
     */
    public function generateMatchExercise(Request $request)
    {
        $orthography = $request->get('orthography', 'post1988');
        $count = $request->get('count', 5);
        $type = $request->get('type'); // vowel, consonant, all

        $query = AlphabetLetter::where('orthography', $orthography);

        if ($type && $type !== 'all') {
            $query->where('type', $type);
        }

        $letters = $query->inRandomOrder()->limit($count)->get();

        return response()->json([
            'exercise' => $letters,
            'orthography' => $orthography,
            'count' => $letters->count(),
        ]);
    }
}
