<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Bienvenue sur l\'API Soussou',
        'version' => '1.0.0',
        'documentation' => '/api/v1',
    ]);
});

// Route CSRF pour Sanctum
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});
