<?php

namespace Database\Seeders;

use App\Models\AlphabetLetter;
use Illuminate\Database\Seeder;

class AlphabetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Alphabet post-1988
        $post1988 = [
            // Voyelles courtes
            ['letter' => 'a', 'upper' => 'A', 'lower' => 'a', 'ipa' => 'a', 'type' => 'vowel', 'category' => 'short', 'orthography' => 'post1988'],
            ['letter' => 'e', 'upper' => 'E', 'lower' => 'e', 'ipa' => 'e', 'type' => 'vowel', 'category' => 'short', 'orthography' => 'post1988'],
            ['letter' => 'ɛ', 'upper' => 'Ɛ', 'lower' => 'ɛ', 'ipa' => 'ɛ', 'type' => 'vowel', 'category' => 'short', 'orthography' => 'post1988', 'examples' => ['ginɛ']],
            ['letter' => 'i', 'upper' => 'I', 'lower' => 'i', 'ipa' => 'i', 'type' => 'vowel', 'category' => 'short', 'orthography' => 'post1988'],
            ['letter' => 'o', 'upper' => 'O', 'lower' => 'o', 'ipa' => 'o', 'type' => 'vowel', 'category' => 'short', 'orthography' => 'post1988'],
            ['letter' => 'ɔ', 'upper' => 'Ɔ', 'lower' => 'ɔ', 'ipa' => 'ɔ', 'type' => 'vowel', 'category' => 'short', 'orthography' => 'post1988', 'examples' => ['pɔsta']],
            ['letter' => 'u', 'upper' => 'U', 'lower' => 'u', 'ipa' => 'u', 'type' => 'vowel', 'category' => 'short', 'orthography' => 'post1988'],

            // Consonnes
            ['letter' => 'b', 'upper' => 'B', 'lower' => 'b', 'ipa' => 'b', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'd', 'upper' => 'D', 'lower' => 'd', 'ipa' => 'd', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'f', 'upper' => 'F', 'lower' => 'f', 'ipa' => 'f', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'g', 'upper' => 'G', 'lower' => 'g', 'ipa' => 'ɡ', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'h', 'upper' => 'H', 'lower' => 'h', 'ipa' => 'h', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'k', 'upper' => 'K', 'lower' => 'k', 'ipa' => 'k', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'l', 'upper' => 'L', 'lower' => 'l', 'ipa' => 'l', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'm', 'upper' => 'M', 'lower' => 'm', 'ipa' => 'm', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'n', 'upper' => 'N', 'lower' => 'n', 'ipa' => 'n', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'ɲ', 'upper' => 'Ɲ', 'lower' => 'ɲ', 'ipa' => 'ɲ', 'type' => 'consonant', 'orthography' => 'post1988', 'examples' => ['ɲari']],
            ['letter' => 'p', 'upper' => 'P', 'lower' => 'p', 'ipa' => 'p', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'r', 'upper' => 'R', 'lower' => 'r', 'ipa' => 'r', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 's', 'upper' => 'S', 'lower' => 's', 'ipa' => 's', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 't', 'upper' => 'T', 'lower' => 't', 'ipa' => 't', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'w', 'upper' => 'W', 'lower' => 'w', 'ipa' => 'w', 'type' => 'consonant', 'orthography' => 'post1988'],
            ['letter' => 'x', 'upper' => 'X', 'lower' => 'x', 'ipa' => 'x', 'type' => 'consonant', 'orthography' => 'post1988', 'examples' => ['xili']],
            ['letter' => 'y', 'upper' => 'Y', 'lower' => 'y', 'ipa' => 'j', 'type' => 'consonant', 'orthography' => 'post1988'],

            // Digraphes
            ['letter' => 'gb', 'upper' => 'Gb', 'lower' => 'gb', 'ipa' => 'ɡ͡b', 'type' => 'digraph', 'orthography' => 'post1988', 'description' => 'Consonne labio-vélaire', 'examples' => ['gbɛŋgbɛ']],
            ['letter' => 'nd', 'upper' => 'Nd', 'lower' => 'nd', 'ipa' => 'ⁿd', 'type' => 'digraph', 'orthography' => 'post1988', 'description' => 'Consonne prénasalisée', 'examples' => ['nde']],
            ['letter' => 'ng', 'upper' => 'Ng', 'lower' => 'ng', 'ipa' => 'ⁿɡ', 'type' => 'digraph', 'orthography' => 'post1988', 'description' => 'Consonne prénasalisée vélaire'],
        ];

        // Alphabet pré-1988
        $pre1988 = [
            // Différences principales
            ['letter' => 'ë', 'upper' => 'Ë', 'lower' => 'ë', 'ipa' => 'ɛ', 'type' => 'vowel', 'category' => 'short', 'orthography' => 'pre1988'],
            ['letter' => 'ö', 'upper' => 'Ö', 'lower' => 'ö', 'ipa' => 'ɔ', 'type' => 'vowel', 'category' => 'short', 'orthography' => 'pre1988'],
            ['letter' => 'kh', 'upper' => 'Kh', 'lower' => 'kh', 'ipa' => 'x', 'type' => 'consonant', 'orthography' => 'pre1988', 'description' => 'Équivalent de x en post-1988'],
            ['letter' => 'ny', 'upper' => 'Ny', 'lower' => 'ny', 'ipa' => 'ɲ', 'type' => 'consonant', 'orthography' => 'pre1988', 'description' => 'Équivalent de ɲ en post-1988'],
        ];

        // Tons
        $tones = [
            ['letter' => 'á', 'type' => 'tone', 'description' => 'Ton haut', 'orthography' => 'post1988'],
            ['letter' => 'à', 'type' => 'tone', 'description' => 'Ton bas', 'orthography' => 'post1988'],
            ['letter' => 'â', 'type' => 'tone', 'description' => 'Ton descendant', 'orthography' => 'post1988'],
            ['letter' => 'ǎ', 'type' => 'tone', 'description' => 'Ton montant', 'orthography' => 'post1988'],
        ];

        // Insérer toutes les lettres
        foreach (array_merge($post1988, $pre1988, $tones) as $letter) {
            AlphabetLetter::create($letter);
        }
    }
}
