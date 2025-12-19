<?php

namespace Database\Seeders;

use App\Models\Number;
use Illuminate\Database\Seeder;

class NumbersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $numbers = [
            // Nombres de 1 à 10 (facile)
            ['number' => 1, 'soussou' => 'kɛrɛn', 'alternatives' => ['kelen'], 'difficulty' => 'easy', 'explanation' => 'Nombre de base: un'],
            ['number' => 2, 'soussou' => 'firin', 'alternatives' => ['fila'], 'difficulty' => 'easy', 'explanation' => 'Nombre de base: deux'],
            ['number' => 3, 'soussou' => 'saxan', 'alternatives' => ['saba'], 'difficulty' => 'easy', 'explanation' => 'Nombre de base: trois'],
            ['number' => 4, 'soussou' => 'naani', 'alternatives' => [], 'difficulty' => 'easy', 'explanation' => 'Nombre de base: quatre'],
            ['number' => 5, 'soussou' => 'soli', 'alternatives' => ['sɔlɔ'], 'difficulty' => 'easy', 'explanation' => 'Nombre de base: cinq'],
            ['number' => 6, 'soussou' => 'sɛnni', 'alternatives' => ['seni'], 'difficulty' => 'easy', 'explanation' => 'Nombre de base: six'],
            ['number' => 7, 'soussou' => 'solofere', 'alternatives' => ['solofɛrɛ'], 'difficulty' => 'easy', 'explanation' => 'Nombre de base: sept'],
            ['number' => 8, 'soussou' => 'soloma', 'alternatives' => ['solomana'], 'difficulty' => 'easy', 'explanation' => 'Nombre de base: huit'],
            ['number' => 9, 'soussou' => 'solonaani', 'alternatives' => [], 'difficulty' => 'easy', 'explanation' => 'Nombre de base: neuf'],
            ['number' => 10, 'soussou' => 'fu', 'alternatives' => ['fùù'], 'difficulty' => 'easy', 'explanation' => 'Nombre de base: dix'],

            // Nombres de 11 à 20 (facile à moyen)
            ['number' => 11, 'soussou' => 'fu nun kɛrɛn', 'alternatives' => ['fu nin kelen'], 'difficulty' => 'easy', 'explanation' => 'Dix et un (10 + 1)'],
            ['number' => 12, 'soussou' => 'fu nun firin', 'alternatives' => ['fu nin fila'], 'difficulty' => 'easy', 'explanation' => 'Dix et deux (10 + 2)'],
            ['number' => 15, 'soussou' => 'fu nun soli', 'alternatives' => [], 'difficulty' => 'easy', 'explanation' => 'Dix et cinq (10 + 5)'],
            ['number' => 20, 'soussou' => 'mɔxɔn', 'alternatives' => ['mokon'], 'difficulty' => 'medium', 'explanation' => 'Base 20: vingt'],

            // Dizaines (moyen)
            ['number' => 30, 'soussou' => 'tɔnɔ', 'alternatives' => ['tono'], 'difficulty' => 'medium', 'explanation' => 'Base 30: trente'],
            ['number' => 40, 'soussou' => 'naanife', 'alternatives' => ['naani fe'], 'difficulty' => 'medium', 'explanation' => 'Quatre dizaines (4 x 10)'],
            ['number' => 50, 'soussou' => 'sulifere', 'alternatives' => ['soli fe'], 'difficulty' => 'medium', 'explanation' => 'Cinq dizaines (5 x 10)'],
            ['number' => 60, 'soussou' => 'sɛnnife', 'alternatives' => ['seni fe'], 'difficulty' => 'medium', 'explanation' => 'Six dizaines (6 x 10)'],
            ['number' => 70, 'soussou' => 'solofɛrɛfe', 'alternatives' => ['solofere fe'], 'difficulty' => 'medium', 'explanation' => 'Sept dizaines (7 x 10)'],
            ['number' => 80, 'soussou' => 'solomafe', 'alternatives' => ['soloma fe'], 'difficulty' => 'medium', 'explanation' => 'Huit dizaines (8 x 10)'],
            ['number' => 90, 'soussou' => 'solonani fe', 'alternatives' => ['solonaani fe'], 'difficulty' => 'medium', 'explanation' => 'Neuf dizaines (9 x 10)'],

            // Centaines (difficile)
            ['number' => 100, 'soussou' => 'kɛmɛ', 'alternatives' => ['keme'], 'difficulty' => 'hard', 'explanation' => 'Base 100: cent'],
            ['number' => 200, 'soussou' => 'kɛmɛ firin', 'alternatives' => ['keme fila'], 'difficulty' => 'hard', 'explanation' => 'Deux cents (2 x 100)'],
            ['number' => 500, 'soussou' => 'kɛmɛ soli', 'alternatives' => ['keme soli'], 'difficulty' => 'hard', 'explanation' => 'Cinq cents (5 x 100)'],
            ['number' => 1000, 'soussou' => 'wuli', 'alternatives' => ['wùlì'], 'difficulty' => 'hard', 'explanation' => 'Base 1000: mille'],

            // Nombres composés (difficile)
            ['number' => 25, 'soussou' => 'mɔxɔn nun soli', 'alternatives' => ['mokon nin soli'], 'difficulty' => 'medium', 'explanation' => 'Vingt et cinq (20 + 5)'],
            ['number' => 33, 'soussou' => 'tɔnɔ nun saxan', 'alternatives' => ['tono nin saba'], 'difficulty' => 'medium', 'explanation' => 'Trente et trois (30 + 3)'],
            ['number' => 47, 'soussou' => 'naanife nun solofere', 'alternatives' => [], 'difficulty' => 'hard', 'explanation' => 'Quarante et sept (40 + 7)'],
            ['number' => 99, 'soussou' => 'solonani fe nun solonaani', 'alternatives' => [], 'difficulty' => 'hard', 'explanation' => 'Quatre-vingt-dix-neuf (90 + 9)'],
            ['number' => 150, 'soussou' => 'kɛmɛ nun sulifere', 'alternatives' => [], 'difficulty' => 'hard', 'explanation' => 'Cent cinquante (100 + 50)'],
            ['number' => 255, 'soussou' => 'kɛmɛ firin nun sulifere nun soli', 'alternatives' => [], 'difficulty' => 'hard', 'explanation' => 'Deux cent cinquante-cinq (200 + 50 + 5)'],
        ];

        foreach ($numbers as $numberData) {
            Number::create([
                'number' => $numberData['number'],
                'soussou_translation' => $numberData['soussou'],
                'alternatives' => $numberData['alternatives'],
                'explanation' => $numberData['explanation'],
                'difficulty' => $numberData['difficulty'],
                'breakdown' => $this->generateBreakdown($numberData['number']),
            ]);
        }
    }

    /**
     * Générer la décomposition d'un nombre
     */
    private function generateBreakdown(int $number): array
    {
        $breakdown = [];

        if ($number >= 1000) {
            $thousands = floor($number / 1000);
            $breakdown[] = ['value' => $thousands * 1000, 'word' => 'wuli', 'operation' => 'x'];
            $number %= 1000;
        }

        if ($number >= 100) {
            $hundreds = floor($number / 100);
            $breakdown[] = ['value' => $hundreds * 100, 'word' => 'kɛmɛ', 'operation' => 'x'];
            $number %= 100;
        }

        if ($number >= 10) {
            $tens = floor($number / 10);
            if ($tens == 2) {
                $breakdown[] = ['value' => 20, 'word' => 'mɔxɔn', 'operation' => ''];
            } elseif ($tens == 3) {
                $breakdown[] = ['value' => 30, 'word' => 'tɔnɔ', 'operation' => ''];
            } else {
                $breakdown[] = ['value' => $tens * 10, 'word' => $tens . 'fe', 'operation' => 'x'];
            }
            $number %= 10;
        }

        if ($number > 0) {
            $breakdown[] = ['value' => $number, 'word' => $this->getBasicNumber($number), 'operation' => '+'];
        }

        return $breakdown;
    }

    private function getBasicNumber(int $num): string
    {
        $basics = [
            1 => 'kɛrɛn', 2 => 'firin', 3 => 'saxan', 4 => 'naani', 5 => 'soli',
            6 => 'sɛnni', 7 => 'solofere', 8 => 'soloma', 9 => 'solonaani'
        ];
        return $basics[$num] ?? '';
    }
}
