<?php

namespace App\Repositories\Contracts;

use App\Models\Task;
use Illuminate\Support\Collection;

interface TaskRepositoryInterface
{
    public function find(string $id): ?Task;

    public function create(array $data): Task;

    public function update(Task $task, array $data): Task;

    public function byProject(string $projectId): Collection;

    public function byIntern(string $internId): Collection;

    public function delete(Task $task): bool;
}