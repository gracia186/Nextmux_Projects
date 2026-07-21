<?php

namespace App\Actions\Permission;

use App\Enums\PermissionStatus;
use App\Exceptions\PermissionAlreadyReviewedException;
use App\Models\Permission;
use App\Models\User;
use App\Repositories\Contracts\PermissionRepositoryInterface;

class ReviewPermissionAction
{
    public function __construct(
        private PermissionRepositoryInterface $permissions,
    ) {
    }

    public function execute(Permission $permission, User $reviewer, PermissionStatus $status, ?string $comment): Permission
    {
        if ($permission->status !== PermissionStatus::Pending) {
            throw new PermissionAlreadyReviewedException('Cette demande de permission a déjà été traitée.');
        }

        return $this->permissions->update($permission, [
            'status' => $status->value,
            'mentor_comment' => $comment,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
        ]);
    }
}