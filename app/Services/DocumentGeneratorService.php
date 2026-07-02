<?php

namespace App\Services;

use App\Enums\DocumentType;
use App\Models\Document;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class DocumentGeneratorService
{
    public function __construct(
        private FileStorageService $fileStorage,
    ) {
    }

    public function generate(Document $document, string $documentNumber): string
    {
        $view = match ($document->type) {
            DocumentType::Attestation => 'pdf.attestation',
            DocumentType::Convention => 'pdf.convention',
        };

        $document->loadMissing(['intern', 'internship']);

        $pdf = Pdf::loadView($view, [
            'document' => $document,
            'intern' => $document->intern,
            'internship' => $document->internship,
            'documentNumber' => $documentNumber,
            'generatedAt' => now(),
        ]);

        $filename = Str::uuid().'.pdf';
        $folder = $document->type === DocumentType::Attestation
            ? 'documents/attestations'
            : 'documents/conventions';

        $path = $folder.'/'.$filename;

        \Illuminate\Support\Facades\Storage::disk('local')->put($path, $pdf->output());

        return $path;
    }
}