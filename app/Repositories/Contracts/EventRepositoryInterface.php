<?php

namespace App\Repositories\Contracts;

use App\Models\Event;
use App\Enums\UserRole;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EventRepositoryInterface
{
    public function find(string $id): ?Event;

    public function create(array $data): Event;

    public function update(Event $event, array $data): Event;

    public function delete(Event $event): bool;

    public function paginateForRole(UserRole $role, int $perPage = 15): LengthAwarePaginator;
}