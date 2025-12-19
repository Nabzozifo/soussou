<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Number extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'soussou_translation',
        'alternatives',
        'explanation',
        'breakdown',
        'difficulty',
    ];

    protected function casts(): array
    {
        return [
            'alternatives' => 'array',
            'breakdown' => 'array',
        ];
    }

    /**
     * Vérifier si une réponse utilisateur est correcte
     */
    public function isCorrectAnswer(string $userAnswer): bool
    {
        $userAnswer = mb_strtolower(trim($userAnswer));
        $correctAnswers = [
            mb_strtolower($this->soussou_translation),
        ];

        if ($this->alternatives) {
            foreach ($this->alternatives as $alt) {
                $correctAnswers[] = mb_strtolower($alt);
            }
        }

        return in_array($userAnswer, $correctAnswers);
    }

    /**
     * Obtenir l'analyse détaillée du nombre
     */
    public function getAnalysis(): array
    {
        // Transformer breakdown en components si disponible
        $components = [];
        if ($this->breakdown && is_array($this->breakdown)) {
            foreach ($this->breakdown as $part) {
                if (isset($part['part']) && isset($part['value'])) {
                    $components[$part['part']] = $part['value'];
                }
            }
        }

        // Transformer explanation en construction_steps si c'est une string
        $constructionSteps = [];
        if ($this->explanation) {
            if (is_array($this->explanation)) {
                $constructionSteps = $this->explanation;
            } else {
                // Si c'est une string, la diviser en étapes
                $lines = explode("\n", $this->explanation);
                foreach ($lines as $line) {
                    $line = trim($line);
                    if (!empty($line)) {
                        $constructionSteps[] = $line;
                    }
                }
            }
        }

        return [
            'number' => $this->number,
            'soussou' => $this->soussou_translation,
            'alternatives' => $this->alternatives ?? [],
            'explanation' => $this->explanation,
            'breakdown' => $this->breakdown ?? [],
            'difficulty' => $this->difficulty,
            // Ajouter les formats attendus par le frontend
            'components' => $components,
            'construction_steps' => $constructionSteps,
        ];
    }
}
