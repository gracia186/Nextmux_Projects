<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\StatsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class AdminStatsController extends Controller
{
    public function __construct(
        private StatsService $statsService,
    ) {
    }

    public function overview(): JsonResponse
    {
        Gate::authorize('viewGlobalStats', \App\Models\User::class);

        return response()->json([
            'success' => true,
            'data' => $this->statsService->globalOverview(),
        ]);
    }

    public function attendance(): JsonResponse
    {
        Gate::authorize('viewGlobalStats', \App\Models\User::class);

        return response()->json([
            'success' => true,
            'data' => $this->statsService->attendanceStats(),
        ]);
    }

    public function reports(): JsonResponse
    {
        Gate::authorize('viewGlobalStats', \App\Models\User::class);

        return response()->json([
            'success' => true,
            'data' => $this->statsService->reportStats(),
        ]);
    }

    public function documents(): JsonResponse
    {
        Gate::authorize('viewGlobalStats', \App\Models\User::class);

        return response()->json([
            'success' => true,
            'data' => $this->statsService->documentStats(),
        ]);
    }
}