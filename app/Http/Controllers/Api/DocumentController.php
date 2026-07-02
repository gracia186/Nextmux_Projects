<?php

namespace App\Http\Controllers\Api;

use App\Actions\Document\GetSecureDocumentUrlAction;
use App\Actions\Document\RequestDocumentAction;
use App\Actions\Document\ValidateDocumentRequestAction;
use App\DTOs\DocumentRequestData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Document\ApproveDocumentRequest;
use App\Http\Requests\Document\RejectDocumentRequest;
use App\Http\Requests\Document\RequestDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Repositories\Contracts\DocumentRepositoryInterface;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use Illuminate\Http\JsonResponse;

class DocumentController extends Controller
{
    public function __construct(
        private RequestDocumentAction $requestDocumentAction,
        private ValidateDocumentRequestAction $validateDocumentAction,
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

        $documents = $user->isAdmin()
            ? $this->documents->pending()
            : $this->documents->forIntern($user->id);

        return response()->json([
            'success' => true,
            'data' => DocumentResource::collection($documents),
        ]);
    }

    public function pending(): JsonResponse
    {
        $this->authorize('validate', \App\Models\Document::class);

        $documents = $this->documents->pending();

        return response()->json([
            'success' => true,
            'data' => DocumentResource::collection($documents),
        ]);
    }

    public function approve(ApproveDocumentRequest $request, string $id): JsonResponse
    {
        $document = $this->documents->find($id);

        $this->authorize('validate', $document);

        $updated = $this->validateDocumentAction->execute($document, auth()->id());

        return response()->json([
            'success' => true,
            'data' => new DocumentResource($updated),
        ]);
    }

    public function reject(RejectDocumentRequest $request, string $id): JsonResponse
    {
        $document = $this->documents->find($id);

        $this->authorize('validate', $document);

        $updated = $this->validateDocumentAction->reject(
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

        $this->authorize('download', $document);

        $url = $this->getSecureUrlAction->execute($document);

        return response()->json([
            'success' => true,
            'data' => ['url' => $url],
        ]);
    }
}