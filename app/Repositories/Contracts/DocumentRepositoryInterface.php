<?php

namespace App\Repositories\Contracts;

use App\Models\Document;
use Illuminate\Support\Collection;

interface DocumentRepositoryInterface
{
    public function find(string $id): ?Document;

    public function create(array $data): Document;

    public function update(Document $document, array $data): Document;

    public function forIntern(string $internId): Collection;

    public function pending(): Collection;

    public function pendingForMentor(string $mentorId): Collection;

    public function pendingForAdmin(): Collection;

    public function nextDocumentNumber(int $year): string;
}