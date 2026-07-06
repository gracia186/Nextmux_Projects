<?php

namespace App\Actions\Document;

use App\Enums\DocumentStatus;
use App\Exceptions\UnauthorizedDocumentAccessException;
use App\Models\Document;
use App\Services\FileStorageService;

class GetSecureDocumentUrlAction
{
    public function __construct(
        private FileStorageService $fileStorage,
    ) {
    }

    public function execute(Document $document): string
    {
        if ($document->status !== DocumentStatus::Completed || ! $document->file_path) {
            throw new UnauthorizedDocumentAccessException(
                'Ce document n\'est pas encore disponible au téléchargement.'
            );
        }

        return $this->fileStorage->temporaryUrl($document->file_path, 15);
    }
}