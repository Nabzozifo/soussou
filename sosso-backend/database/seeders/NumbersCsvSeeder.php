<?php

namespace Database\Seeders;

use App\Models\Number;
use Illuminate\Database\Seeder;

class NumbersCsvSeeder extends Seeder
{
    /**
     * Import tous les nombres depuis le fichier CSV
     */
    public function run(): void
    {
        // Chemin vers le fichier CSV
        $csvFile = base_path('../data/nombres_soussou_1_9999.csv');

        if (!file_exists($csvFile)) {
            $this->command->error("Le fichier CSV n'existe pas: {$csvFile}");
            return;
        }

        $this->command->info("📥 Importation des nombres depuis le CSV...");

        // Vider la table avant l'import
        Number::truncate();

        $handle = fopen($csvFile, 'r');
        $header = fgetcsv($handle, 1000, ';'); // Lire l'entête

        $count = 0;
        $batchData = [];

        while (($data = fgetcsv($handle, 1000, ';')) !== false) {
            $number = (int)$data[0];
            $soussou = trim($data[1]);

            // Déterminer la difficulté
            $difficulty = $this->getDifficulty($number);

            // Générer l'explication
            $explanation = $this->generateExplanation($number);

            // Générer des alternatives
            $alternatives = $this->generateAlternatives($soussou);

            $batchData[] = [
                'number' => $number,
                'soussou_translation' => $soussou,
                'alternatives' => json_encode($alternatives),
                'explanation' => $explanation,
                'difficulty' => $difficulty,
                'breakdown' => json_encode($this->generateBreakdown($number)),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $count++;

            // Insérer par batch de 500
            if (count($batchData) >= 500) {
                Number::insert($batchData);
                $batchData = [];
                $this->command->info("✅ {$count} nombres importés...");
            }
        }

        // Insérer les derniers
        if (!empty($batchData)) {
            Number::insert($batchData);
        }

        fclose($handle);

        $this->command->info("🎉 Importation terminée: {$count} nombres importés !");
    }

    /**
     * Déterminer la difficulté selon le nombre
     */
    private function getDifficulty(int $number): string
    {
        if ($number <= 20) {
            return 'easy';
        } elseif ($number <= 100) {
            return 'medium';
        } else {
            return 'hard';
        }
    }

    /**
     * Générer l'explication de la construction du nombre
     */
    private function generateExplanation(int $number): string
    {
        if ($number <= 10) {
            return "Nombre de base";
        } elseif ($number <= 20) {
            return "Construction: 10 + " . ($number - 10);
        } elseif ($number < 100) {
            $tens = floor($number / 10) * 10;
            $units = $number % 10;
            if ($units == 0) {
                return "Dizaine: {$tens}";
            }
            return "Construction: {$tens} + {$units}";
        } elseif ($number == 100) {
            return "Centaine";
        } elseif ($number < 1000) {
            $hundreds = floor($number / 100) * 100;
            $rest = $number % 100;
            if ($rest == 0) {
                return "Construction: " . ($hundreds / 100) . " × 100";
            }
            return "Construction: {$hundreds} + {$rest}";
        } elseif ($number == 1000) {
            return "Millier";
        } else {
            $thousands = floor($number / 1000) * 1000;
            $rest = $number % 1000;
            if ($rest == 0) {
                return "Construction: " . ($thousands / 1000) . " × 1000";
            }
            return "Construction: {$thousands} + {$rest}";
        }
    }

    /**
     * Générer des variantes orthographiques
     */
    private function generateAlternatives(string $soussou): array
    {
        $alternatives = [];

        // Variantes sans tons
        $withoutTones = preg_replace('/[̀́̂̌̆̌̄]/u', '', $soussou);
        if ($withoutTones !== $soussou) {
            $alternatives[] = $withoutTones;
        }

        // Variantes avec 'nŭn' -> 'nin' | 'nun'
        if (str_contains($soussou, 'nŭn')) {
            $alternatives[] = str_replace('nŭn', 'nin', $soussou);
            $alternatives[] = str_replace('nŭn', 'nun', $soussou);
        }

        // Variantes sans accents du tout
        $noAccents = strtr($soussou, [
            'à' => 'a', 'á' => 'a', 'â' => 'a', 'ǎ' => 'a',
            'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ě' => 'e',
            'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ǐ' => 'i',
            'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'ǒ' => 'o',
            'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ǔ' => 'u',
            'ɛ̀' => 'ɛ', 'ɛ́' => 'ɛ', 'ɛ̂' => 'ɛ',
            'ɔ̀' => 'ɔ', 'ɔ́' => 'ɔ', 'ɔ̂' => 'ɔ',
            'ŭ' => 'u', 'nŭn' => 'nun',
        ]);

        if ($noAccents !== $soussou) {
            $alternatives[] = $noAccents;
        }

        return array_values(array_unique($alternatives));
    }

    /**
     * Générer la décomposition d'un nombre
     */
    private function generateBreakdown(int $number): array
    {
        $breakdown = [];

        if ($number >= 1000) {
            $thousands = floor($number / 1000);
            $breakdown[] = ['value' => $thousands * 1000, 'word' => 'wùlì', 'operation' => '×'];
            $number %= 1000;
        }

        if ($number >= 100) {
            $hundreds = floor($number / 100);
            $breakdown[] = ['value' => $hundreds * 100, 'word' => 'k̀ɛḿɛ', 'operation' => '×'];
            $number %= 100;
        }

        if ($number >= 10) {
            $tens = floor($number / 10);
            if ($tens == 2) {
                $breakdown[] = ['value' => 20, 'word' => 'm̀ɔx̀ɔǵɛŋ', 'operation' => ''];
            } elseif ($tens == 3) {
                $breakdown[] = ['value' => 30, 'word' => 'tòngó sàxán', 'operation' => ''];
            } else {
                $breakdown[] = ['value' => $tens * 10, 'word' => 'tòngó', 'operation' => '×'];
            }
            $number %= 10;
        }

        if ($number > 0) {
            $basics = [
                1 => 'kérén', 2 => 'fírín', 3 => 'sàxán', 4 => 'náání', 5 => 'súlí',
                6 => 'sénní', 7 => 'sólófèré', 8 => 'sólómásàxán', 9 => 'sólómánáání'
            ];
            $breakdown[] = ['value' => $number, 'word' => $basics[$number] ?? '', 'operation' => '+'];
        }

        return $breakdown;
    }
}
