<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlphabetLetter extends Model
{
    use HasFactory;

    protected $table = 'alphabet';

    protected $fillable = [
        'letter',
        'upper',
        'lower',
        'ipa',
        'type',
        'category',
        'description',
        'examples',
        'orthography',
    ];

    protected function casts(): array
    {
        return [
            'examples' => 'array',
        ];
    }

    public static function getByOrthography(string $orthography = 'post1988')
    {
        return self::where('orthography', $orthography)->get();
    }

    public static function getByType(string $type, string $orthography = 'post1988')
    {
        return self::where('type', $type)
            ->where('orthography', $orthography)
            ->get();
    }
}
