<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateInternshipDatesRequest;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class AdminInternshipController extends Controller
{
    public function __construct(
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function updateDates(UpdateInternshipDatesRequest $request, string $internId): JsonResponse
    {
        Gate::authorize('manage', \App\Models\User::class);

        $internship = $this->internships->findActiveByIntern($internId);

        if (! $internship) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'NO_ACTIVE_INTERNSHIP',
                    'message' => 'Aucun stage actif trouvé pour ce stagiaire.',
                ],
            ], 404);
        }

        $updated = $this->internships->update($internship, $request->validated());

        return response()->json([
            'success' => true,
            'data' => $updated,
        ]);
    }
}
