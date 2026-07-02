<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface UserRepositoryInterface
{
    public function find(string $id): ?User;

    public function findByEmail(string $email): ?User;

    public function findByInvitationToken(string $hashedToken): ?User;

    public function create(array $data): User;

    public function update(User $user, array $data): User;

    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;

    public function mentorsWithInterns(): Collection;
}