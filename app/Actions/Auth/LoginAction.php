<?php

namespace App\Actions\Auth;

use App\DTOs\LoginData;
use App\Enums\UserStatus;
use App\Exceptions\AccountNotActiveException;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class LoginAction
{
    public function __construct(
        private UserRepositoryInterface $users,
    ) {
    }

    public function execute(LoginData $data, string $throttleKey): User
    {
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw new \Illuminate\Http\Exceptions\ThrottleRequestsException(
                "Trop de tentatives. Réessayez dans {$seconds} secondes."
            );
        }

        $user = $this->users->findByEmail($data->email);

        if (! $user || ! Hash::check($data->password, $user->password)) {
            RateLimiter::hit($throttleKey, 60);

            throw new AuthenticationException('Identifiants incorrects.');
        }

        if ($user->status !== UserStatus::Active) {
            throw new AccountNotActiveException('Votre compte n\'est pas encore actif.');
        }

        RateLimiter::clear($throttleKey);

        return $user;
    }
}