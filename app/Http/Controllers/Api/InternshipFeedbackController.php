<?php

namespace App\Http\Controllers\Api;

use App\Actions\InternshipFeedback\SubmitInternshipFeedbackAction;
use App\DTOs\InternshipFeedbackData;
use App\Http\Controllers\Controller;
use App\Http\Resources\InternshipFeedbackResource;
use App\Http\Requests\InternshipFeedback\SubmitInternshipFeedbackRequest;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class InternshipFeedbackController extends Controller
{
    public function __construct(
        private SubmitInternshipFeedbackAction $submitFeedbackAction,
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function store(SubmitInternshipFeedbackRequest $request): JsonResponse
    {
        $user = auth()->user();

        $internship = $this->internships->findActiveByIntern($user->id);

        if (! $internship) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'NO_ACTIVE_INTERNSHIP',
                    'message' => 'Aucun stage actif trouvé.',
                ],
            ], 422);
        }

        $data = InternshipFeedbackData::fromArray(array_merge($request->validated(), [
            'intern_id' => $user->id,
            'internship_id' => $internship->id,
        ]));

        $feedback = $this->submitFeedbackAction->execute($data);

        return response()->json([
            'success' => true,
            'data' => new InternshipFeedbackResource($feedback),
        ], 201);
    }
}
