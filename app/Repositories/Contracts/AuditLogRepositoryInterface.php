<?php

namespace App\Repositories\Contracts;

use App\Models\AuditLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AuditLogRepositoryInterface
{
    public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator;
}
