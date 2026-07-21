<?php

namespace App\Actions\Permission;

use App\DTOs\PermissionData;
use App\Enums\PermissionStatus;
use App\Models\Permission;
use App\Repositories\Contracts\PermissionRepositoryInterface;
use Illuminate\Support\Str;

class RequestPermissionAction
{
    public function __construct(
        private PermissionRepositoryInterface $permissions,
    ) {
    }

    public function execute(PermissionData $data): Permission
    {
        return $this->permissions->create([
            'id' => (string) Str::uuid(),
            'intern_id' => $data->internId,
            'internship_id' => $data->internshipId,
            'date' => $data->date,
            'reason' => $data->reason,
            'status' => PermissionStatus::Pending->value,
        ]);
    }
}