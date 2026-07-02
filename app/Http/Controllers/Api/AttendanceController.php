<?php

namespace App\Http\Controllers\Api;

use App\Actions\Attendance\GetAttendanceDashboardAction;
use App\Actions\Attendance\RecordAttendanceAction;
use App\DTOs\AttendanceData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\RecordAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AttendanceController extends Controller
{
    public function __construct(
        private RecordAttendanceAction $recordAttendanceAction,
        private GetAttendanceDashboardAction $getDashboardAction,
        private AttendanceRepositoryInterface $attendances,
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function store(RecordAttendanceRequest $request): JsonResponse
    {
        $user = auth()->user();

        $internship = $this->internships->findActiveByIntern($user->id);

        if (! $internship) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'NO_ACTIVE_INTERNSHIP',
                    'message' => 'Aucun stage actif trouvé pour cet utilisateur.',
                ],
            ], 422);
        }

        $data = AttendanceData::fromArray(array_merge($request->validated(), [
            'intern_id' => $user->id,
            'internship_id' => $internship->id,
        ]));

        $attendance = $this->recordAttendanceAction->execute($data);

        return response()->json([
            'success' => true,
            'data' => new AttendanceResource($attendance),
        ], 201);
    }

    public function history(): JsonResponse
    {
        $attendances = $this->attendances->historyForIntern(auth()->id());

        return response()->json([
            'success' => true,
            'data' => AttendanceResource::collection($attendances),
        ]);
    }

    public function dashboard(): JsonResponse
    {
        $this->authorize('viewDashboard', \App\Models\Attendance::class);

        $result = $this->getDashboardAction->execute(auth()->user());

        return response()->json([
            'success' => true,
            'data' => [
                'attendances' => AttendanceResource::collection($result['attendances']),
                'stats' => $result['stats'],
            ],
        ]);
    }

    public function byIntern(string $internId): JsonResponse
    {
        $attendances = $this->attendances->historyForIntern($internId);

        return response()->json([
            'success' => true,
            'data' => AttendanceResource::collection($attendances),
        ]);
    }

    public function correct(string $id, \Illuminate\Http\Request $request): JsonResponse
    {
        $attendance = $this->attendances->find($id);

        $this->authorize('correct', $attendance);

        $validated = $request->validate([
            'status' => ['required', \Illuminate\Validation\Rule::enum(\App\Enums\AttendanceStatus::class)],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $updated = $this->attendances->update($attendance, $validated);

        return response()->json([
            'success' => true,
            'data' => new AttendanceResource($updated),
        ]);
    }
}