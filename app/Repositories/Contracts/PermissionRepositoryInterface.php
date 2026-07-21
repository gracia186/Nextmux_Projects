<?php

namespace App\Repositories\Contracts;

use App\Models\Permission;
use Illuminate\Support\Collection;

interface PermissionRepositoryInterface
{
    public function find(string $id): ?Permission;

    public function create(array $data): Permission;

    public function update(Permission $permission, array $data): Permission;

    public function historyForIntern(string $internId): Collection;

    public function pendingForMentor(string $mentorId): Collection;
}