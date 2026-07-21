<?php

namespace App\Http\Controllers\Api;

use App\Actions\Internship\CreateInternshipAction;
use App\DTOs\CreateInternshipData;
use App\Enums\InternshipStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Internship\CreateInternshipRequest;
use App\Http\Requests\Internship\TerminateInternshipRequest;
use App\Http\Resources\InternshipResource;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class InternshipController extends Controller
{
    public function __construct(
        private CreateInternshipAction $createInternshipAction,
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', \App\Models\Internship::class);

        $user = auth()->user();

        $internships = $user->isAdmin()
            ? $this->internships->all()
            : $this->internships->internsByMentor($user->id);

        return response()->json([
            'success' => true,
            'data' => InternshipResource::collection($internships),
        ]);
    }

    public function store(CreateInternshipRequest $request): JsonResponse
    {
        $data = CreateInternshipData::fromArray($request->validated());

        $internship = $this->createInternshipAction->execute($data);

        return response()->json([
            'success' => true,
            'data' => new InternshipResource($internship),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $internship = $this->internships->find($id);

        if (! $internship) {
            return response()->json([
                'success' => false,
                'error' => ['code' => 'INTERNSHIP_NOT_FOUND', 'message' => 'Stage introuvable.'],
            ], 404);
        }

        Gate::authorize('view', $internship);

        return response()->json([
            'success' => true,
            'data' => new InternshipResource($internship),
        ]);
    }

    public function terminate(string $id, TerminateInternshipRequest $request): JsonResponse
    {
        $internship = $this->internships->find($id);

        if (! $internship) {
            return response()->json([
                'success' => false,
                'error' => ['code' => 'INTERNSHIP_NOT_FOUND', 'message' => 'Stage introuvable.'],
            ], 404);
        }

        Gate::authorize('terminate', $internship);

        $updated = $this->internships->update($internship, [
            'status' => InternshipStatus::Terminated->value,
            'termination_reason' => $request->validated('termination_reason'),
        ]);

        return response()->json([
            'success' => true,
            'data' => new InternshipResource($updated),
        ]);
    }
}