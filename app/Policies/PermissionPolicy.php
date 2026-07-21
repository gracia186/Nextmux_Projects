<?php

namespace App\Policies;

use App\Models\Permission;
use App\Models\User;

class PermissionPolicy
{
    public function create(User $user): bool
    {
        return $user->isIntern();
    }

    public function view(User $user, Permission $permission): bool
    {
        return $user->isAdmin()
            || $permission->intern_id === $user->id
            || ($user->isMentor() && $permission->internship->mentor_id === $user->id);
    }

    public function review(User $user, Permission $permission): bool
    {
        return $user->isMentor() && $permission->internship->mentor_id === $user->id;
    }
}