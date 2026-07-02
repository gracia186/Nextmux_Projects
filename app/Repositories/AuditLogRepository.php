<?php

namespace App\Repositories;

use App\Models\AuditLog;
use App\Repositories\Contracts\AuditLogRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AuditLogRepository implements AuditLogRepositoryInterface
{
    public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator
    {
        $query = AuditLog::query();

        if (! empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (! empty($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (! empty($filters['target_type'])) {
            $query->where('target_type', $filters['target_type']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
