<?php

namespace App\Actions\Auth;

use App\DTOs\AcceptInvitationData;
use App\Enums\UserStatus;
use App\Exceptions\InvalidInvitationTokenException;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class AcceptInvitationAction
{
    public function __construct(
        private UserRepositoryInterface $users,
    ) {
    }

    public function execute(AcceptInvitationData $data): User
    {
        $hashedToken = hash('sha256', $data->token);

        $user = $this->users->findByInvitationToken($hashedToken);

        if (! $user) {
            throw new InvalidInvitationTokenException('Ce lien d\'invitation est invalide ou expiré.');
        }

        return $this->users->update($user, [
            'password' => Hash::make($data->password),
            'status' => UserStatus::Active->value,
            'invitation_token' => null,
            'invitation_token_expires_at' => null,
            'invitation_accepted_at' => now(),
        ]);
    }
}