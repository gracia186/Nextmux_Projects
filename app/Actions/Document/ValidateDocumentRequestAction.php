<?php

namespace App\Actions\Document;

use App\Enums\DocumentStatus;
use App\Jobs\GenerateDocumentPDFJob;
use App\Models\Document;
use App\Repositories\Contracts\DocumentRepositoryInterface;

class ValidateDocumentRequestAction
{
    public function __construct(
        private DocumentRepositoryInterface $documents,
    ) {
    }

    public function execute(Document $document, string $reviewedBy): Document
    {
        $updated = $this->documents->update($document, [
            'status' => DocumentStatus::Approved->value,
            'reviewed_by' => $reviewedBy,
            'reviewed_at' => now(),
        ]);

        GenerateDocumentPDFJob::dispatch($updated);

        return $updated;
    }

    public function reject(Document $document, string $reviewedBy, string $reason): Document
    {
        return $this->documents->update($document, [
            'status' => DocumentStatus::Rejected->value,
            'reviewed_by' => $reviewedBy,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }
}