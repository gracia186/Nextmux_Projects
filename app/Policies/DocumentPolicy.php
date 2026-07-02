<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    public function request(User $user): bool
    {
        return $user->isIntern();
    }

    public function view(User $user, Document $document): bool
    {
        return $user->isAdmin() || $document->intern_id === $user->id;
    }

    public function validate(User $user, Document $document = null): bool
    {
        if ($document === null) {
            return $user->isAdmin();
        }

        return $user->isAdmin();
    }

    public function download(User $user, Document $document): bool
    {
        return $this->view($user, $document);
    }
}
