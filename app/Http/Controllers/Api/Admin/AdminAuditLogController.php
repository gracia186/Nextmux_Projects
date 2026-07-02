<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Repositories\Contracts\AuditLogRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AdminAuditLogController extends Controller
{
    public function __construct(
        private AuditLogRepositoryInterface $auditLogs,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAuditLogs', \App\Models\AuditLog::class);

        $logs = $this->auditLogs->paginate(20, $request->only(['user_id', 'action', 'target_type']));

        return response()->json([
            'success' => true,
            'data' => AuditLogResource::collection($logs),
            'meta' => [
                'total' => $logs->total(),
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
            ],
        ]);
    }
}
