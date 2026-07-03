<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route utilisée par la notification de réinitialisation de mot de passe
Route::get('password/reset/{token}', function ($token) {
    $frontend = rtrim(config('app.frontend_url', config('app.url')), '/');
    $email = request()->query('email');
    $url = $frontend.'/reset-password?token='.$token.($email ? '&email='.urlencode($email) : '');

    return redirect()->away($url);
})->name('password.reset');
