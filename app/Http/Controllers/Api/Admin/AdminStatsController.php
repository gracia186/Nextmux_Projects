<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\StatsService;
use Illuminate\Http\JsonResponse;

class AdminStatsController extends Controller
{
    public function __construct(
        private StatsService $statsService,
    ) {
    }

    public function overview(): JsonResponse
    {
        $this->authorize('viewGlobalStats', \App\Models\User::class);

        return response()->json([
            'success' => true,
            'data' => $this->statsService->globalOverview(),
        ]);
    }

    public function attendance(): JsonResponse
    {
        $this->authorize('viewGlobalStats', \App\Models\User::class);

        return response()->json([
            'success' => true,
            'data' => $this->statsService->attendanceStats(),
        ]);
    }

    public function reports(): JsonResponse
    {
        $this->authorize('viewGlobalStats', \App\Models\User::class);

        return response()->json([
            'success' => true,
            'data' => $this->statsService->reportStats(),
        ]);
    }

    public function documents(): JsonResponse
    {
        $this->authorize('viewGlobalStats', \App\Models\User::class);

        return response()->json([
            'success' => true,
            'data' => $this->statsService->documentStats(),
        ]);
    }
}