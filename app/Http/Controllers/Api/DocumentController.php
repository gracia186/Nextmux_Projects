<?php

namespace App\Http\Controllers\Api;

use App\Actions\Document\AdminProcessDocumentAction;
use App\Actions\Document\GetSecureDocumentUrlAction;
use App\Actions\Document\MentorValidateDocumentAction;
use App\Actions\Document\RequestDocumentAction;
use App\DTOs\DocumentRequestData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Document\MentorValidateDocumentRequest;
use App\Http\Requests\Document\RejectDocumentRequest;
use App\Http\Requests\Document\RequestDocumentRequest;
use App\Http\Requests\Document\UploadDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Repositories\Contracts\DocumentRepositoryInterface;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class DocumentController extends Controller
{
    public function __construct(
        private RequestDocumentAction $requestDocumentAction,
        private MentorValidateDocumentAction $mentorValidateAction,
        private AdminProcessDocumentAction $adminProcessAction,
        private GetSecureDocumentUrlAction $getSecureUrlAction,
        private DocumentRepositoryInterface $documents,
        private InternshipRepositoryInterface $internships,
    ) {
    }

    public function store(RequestDocumentRequest $request): JsonResponse
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

        $data = DocumentRequestData::fromArray(array_merge($request->validated(), [
            'intern_id' => $user->id,
            'internship_id' => $internship->id,
        ]));

        $document = $this->requestDocumentAction->execute($data);

        return response()->json([
            'success' => true,
            'data' => new DocumentResource($document),
        ], 201);
    }

    public function index(): JsonResponse
    {
        $user = auth()->user();

        $documents = $user->isIntern()
            ? $this->documents->forIntern($user->id)
            : $this->documents->pending();

        return response()->json([
            'success' => true,
            'data' => DocumentResource::collection($documents),
        ]);
    }

    public function pending(): JsonResponse
    {
        if (! auth()->user()->isMentor()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $documents = $this->documents->pendingForMentor(auth()->id());

        return response()->json([
            'success' => true,
            'data' => DocumentResource::collection($documents),
        ]);
    }

    public function adminPending(): JsonResponse
    {
        Gate::authorize('processAsAdmin', \App\Models\Document::class);

        $documents = $this->documents->pendingForAdmin();

        return response()->json([
            'success' => true,
            'data' => DocumentResource::collection($documents),
        ]);
    }

    public function mentorValidate(MentorValidateDocumentRequest $request, string $id): JsonResponse
    {
        $document = $this->documents->find($id);

        Gate::authorize('mentorValidate', $document);

        $updated = $request->validated('status') === 'approved'
            ? $this->mentorValidateAction->approve($document, auth()->id())
            : $this->mentorValidateAction->reject($document, auth()->id(), $request->validated('rejection_reason'));

        return response()->json([
            'success' => true,
            'data' => new DocumentResource($updated),
        ]);
    }

    public function upload(UploadDocumentRequest $request, string $id): JsonResponse
    {
        $document = $this->documents->find($id);

        Gate::authorize('processAsAdmin', \App\Models\Document::class);

        $updated = $this->adminProcessAction->upload($document, auth()->id(), $request->file('file'));

        return response()->json([
            'success' => true,
            'data' => new DocumentResource($updated),
        ]);
    }

    public function reject(RejectDocumentRequest $request, string $id): JsonResponse
    {
        $document = $this->documents->find($id);

        Gate::authorize('processAsAdmin', \App\Models\Document::class);

        $updated = $this->adminProcessAction->reject(
            $document,
            auth()->id(),
            $request->validated('rejection_reason')
        );

        return response()->json([
            'success' => true,
            'data' => new DocumentResource($updated),
        ]);
    }

    public function download(string $id): JsonResponse
    {
        $document = $this->documents->find($id);

        Gate::authorize('download', $document);

        $url = $this->getSecureUrlAction->execute($document);

        return response()->json([
            'success' => true,
            'data' => ['url' => $url],
        ]);
    }
}