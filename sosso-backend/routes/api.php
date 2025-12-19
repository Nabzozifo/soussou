<?php

use App\Http\Controllers\AlphabetController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\NumberController;
use App\Http\Controllers\PartnershipController;
use App\Http\Controllers\ProgressController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes publiques
Route::prefix('v1')->group(function () {

    // Authentification
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Nombres (lecture seule publique)
    Route::get('/numbers/random', [NumberController::class, 'getRandom']);
    Route::get('/numbers/{value}', [NumberController::class, 'getByValue']);
    Route::get('/numbers', [NumberController::class, 'index']);
    Route::get('/numbers/range', [NumberController::class, 'getRange']);
    Route::post('/numbers/check-answer', [NumberController::class, 'checkAnswer']);
    Route::get('/numbers/{id}/analyze', [NumberController::class, 'analyze']);

    // Alphabet (lecture seule publique)
    Route::get('/alphabet', [AlphabetController::class, 'index']);
    Route::get('/alphabet/vowels', [AlphabetController::class, 'getVowels']);
    Route::get('/alphabet/consonants', [AlphabetController::class, 'getConsonants']);
    Route::get('/alphabet/digraphs', [AlphabetController::class, 'getDigraphs']);
    Route::get('/alphabet/{id}', [AlphabetController::class, 'show']);
    Route::get('/alphabet/exercise/match', [AlphabetController::class, 'generateMatchExercise']);

    // Quiz et jeux publics
    Route::post('/game/quiz/generate', [GameController::class, 'generateQuiz']);
    Route::post('/game/quiz/check', [GameController::class, 'checkQuiz']);
    Route::get('/game/stats/global', [GameController::class, 'getGlobalStats']);

    // Contact et partenariats (publics)
    Route::post('/contact', [ContactController::class, 'sendMessage']);
    Route::post('/partnership', [ContactController::class, 'submitPartnership']);

    // Blog (lecture publique)
    Route::get('/blog', [BlogController::class, 'index']);
    Route::get('/blog/{id}', [BlogController::class, 'show']);
});

// Routes protégées (nécessitent authentification)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/password/change', [AuthController::class, 'changePassword']);

    // Progression utilisateur
    Route::get('/progress', [ProgressController::class, 'getProgress']);
    Route::get('/dashboard', [ProgressController::class, 'getDashboard']);
    Route::put('/progress/difficulty', [ProgressController::class, 'updateDifficulty']);
    Route::post('/progress/achievement', [ProgressController::class, 'addAchievement']);
    Route::delete('/progress/reset', [ProgressController::class, 'resetProgress']);
    Route::get('/leaderboard', [ProgressController::class, 'getLeaderboard']);

    // Sessions de jeu
    Route::post('/game/session', [GameController::class, 'saveSession']);
    Route::get('/game/sessions', [GameController::class, 'getSessions']);

    // Blog (admin uniquement)
    Route::middleware('admin')->group(function () {
        Route::post('/blog', [BlogController::class, 'store']);
        Route::put('/blog/{id}', [BlogController::class, 'update']);
        Route::delete('/blog/{id}', [BlogController::class, 'destroy']);
        Route::post('/blog/{id}/publish', [BlogController::class, 'publish']);

        // Gestion des contacts (admin)
        Route::get('/admin/contacts', [ContactController::class, 'getAllMessages']);
        Route::put('/admin/contacts/{id}/read', [ContactController::class, 'markAsRead']);
        Route::delete('/admin/contacts/{id}', [ContactController::class, 'deleteMessage']);

        // Gestion des partenariats (admin)
        Route::get('/admin/partnerships', [ContactController::class, 'getAllPartnerships']);
        Route::put('/admin/partnerships/{id}/status', [ContactController::class, 'updatePartnershipStatus']);
    });
});

// Routes de compatibilité SANS /v1 (pour le frontend actuel)
// Ces routes permettent d'appeler /api/register au lieu de /api/v1/register

// Authentification publique
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Nombres publics
Route::get('/numbers/random', [NumberController::class, 'getRandom']);
Route::post('/numbers/check-answer', [NumberController::class, 'checkAnswer']);
Route::get('/numbers/{id}/analyze', [NumberController::class, 'analyze']);
Route::get('/numbers/{value}', [NumberController::class, 'getByValue']);

// Quiz et jeux publics
Route::post('/game/quiz/generate', [GameController::class, 'generateQuiz']);
Route::post('/game/quiz/check', [GameController::class, 'checkQuiz']);

// Routes protégées sans /v1
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/progress', [ProgressController::class, 'getProgress']);
    Route::post('/progress', [ProgressController::class, 'getProgress']); // Accepter POST aussi
    Route::get('/dashboard', [ProgressController::class, 'getDashboard']);
    Route::post('/game/session', [GameController::class, 'saveSession']);
});

// Route de test
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API Soussou is running',
        'timestamp' => now(),
    ]);
});
