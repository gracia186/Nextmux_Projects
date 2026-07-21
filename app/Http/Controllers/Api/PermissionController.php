<?php

namespace App\Http\Controllers\Api;

use App\Actions\Permission\RequestPermissionAction;
use App\Actions\Permission\ReviewPermissionAction;
use App\DTOs\PermissionData;
use App\Enums\PermissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Permission\RequestPermissionRequest;
use App\Http\Requests\Permission\ReviewPermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use App\Repositories\Contracts\PermissionRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class PermissionController extends Controller
{
    public function __construct(
        private RequestPermissionAction $requestPermissionAction,
        private ReviewPermissionAction $reviewPermissionAction,
        private PermissionRepositoryInterface $permissions,
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function store(RequestPermissionRequest $request): JsonResponse
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

        $data = PermissionData::fromArray(array_merge($request->validated(), [
            'intern_id' => $user->id,
            'internship_id' => $internship->id,
        ]));

        $permission = $this->requestPermissionAction->execute($data);

        return response()->json([
            'success' => true,
            'data' => new PermissionResource($permission),
        ], 201);
    }

    public function history(): JsonResponse
    {
        $permissions = $this->permissions->historyForIntern(auth()->id());

        return response()->json([
            'success' => true,
            'data' => PermissionResource::collection($permissions),
        ]);
    }

    public function pending(): JsonResponse
    {
        $permissions = $this->permissions->pendingForMentor(auth()->id());

        return response()->json([
            'success' => true,
            'data' => PermissionResource::collection($permissions),
        ]);
    }

    public function review(string $id, ReviewPermissionRequest $request): JsonResponse
    {
        $permission = $this->permissions->find($id);

        if (! $permission) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'PERMISSION_NOT_FOUND',
                    'message' => 'Demande de permission introuvable.',
                ],
            ], 404);
        }

        Gate::authorize('review', $permission);

        $validated = $request->validated();

        $updated = $this->reviewPermissionAction->execute(
            $permission,
            auth()->user(),
            PermissionStatus::from($validated['status']),
            $validated['mentor_comment'] ?? null
        );

        return response()->json([
            'success' => true,
            'data' => new PermissionResource($updated),
        ]);
    }
}