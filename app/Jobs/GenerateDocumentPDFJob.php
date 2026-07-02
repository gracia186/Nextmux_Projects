<?php

namespace App\Jobs;

use App\Enums\DocumentStatus;
use App\Models\Document;
use App\Notifications\DocumentReadyNotification;
use App\Repositories\Contracts\DocumentRepositoryInterface;
use App\Services\DocumentGeneratorService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateDocumentPDFJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public Document $document,
    ) {
    }

    public function handle(
        DocumentGeneratorService $generator,
        DocumentRepositoryInterface $documents,
    ): void {
        $documentNumber = $documents->nextDocumentNumber(now()->year);

        $filePath = $generator->generate($this->document, $documentNumber);

        $documents->update($this->document, [
            'status' => DocumentStatus::Generated->value,
            'file_path' => $filePath,
            'document_number' => $documentNumber,
            'generated_at' => now(),
        ]);

        $this->document->intern->notify(new DocumentReadyNotification($this->document));
    }

    public function failed(\Throwable $exception): void
    {
        app(DocumentRepositoryInterface::class)->update($this->document, [
            'status' => DocumentStatus::Approved->value,
        ]);
    }
}