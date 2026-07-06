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
        if ($user->isAdmin()) {
            return true;
        }

        if ($document->intern_id === $user->id) {
            return true;
        }

        return $user->isMentor() && $document->internship?->mentor_id === $user->id;
    }

    public function mentorValidate(User $user, Document $document): bool
    {
        return $user->isMentor() && $document->internship?->mentor_id === $user->id;
    }

    public function processAsAdmin(User $user): bool
    {
        return $user->isAdmin();
    }

    public function download(User $user, Document $document): bool
    {
        return $this->view($user, $document);
    }
}