<?php

namespace App\Policies;

use App\Models\Internship;
use App\Models\User;

class InternshipPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isMentor();
    }

    public function view(User $user, Internship $internship): bool
    {
        return $user->isAdmin()
            || $internship->mentor_id === $user->id
            || $internship->intern_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function terminate(User $user, Internship $internship): bool
    {
        return $user->isAdmin();
    }
}