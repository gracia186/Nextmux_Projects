<?php

namespace App\Repositories;

use App\Enums\DocumentStatus;
use App\Models\Document;
use App\Repositories\Contracts\DocumentRepositoryInterface;
use Illuminate\Support\Collection;

class DocumentRepository implements DocumentRepositoryInterface
{
    public function find(string $id): ?Document
    {
        return Document::find($id);
    }

    public function create(array $data): Document
    {
        return Document::create($data);
    }

    public function update(Document $document, array $data): Document
    {
        $document->update($data);
        return $document->fresh();
    }

    public function forIntern(string $internId): Collection
    {
        return Document::where('intern_id', $internId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function pending(): Collection
    {
        return Document::where('status', DocumentStatus::Pending->value)
            ->with('intern')
            ->orderBy('requested_at', 'asc')
            ->get();
    }

    public function pendingForMentor(string $mentorId): Collection
    {
        return Document::whereHas('internship', fn ($q) => $q->where('mentor_id', $mentorId))
            ->where('status', DocumentStatus::Pending->value)
            ->with(['intern', 'internship'])
            ->orderBy('requested_at', 'asc')
            ->get();
    }

    public function pendingForAdmin(): Collection
    {
        return Document::where('status', DocumentStatus::MentorApproved->value)
            ->with(['intern', 'internship', 'mentor'])
            ->orderBy('mentor_validated_at', 'asc')
            ->get();
    }

    public function nextDocumentNumber(int $year): string
    {
        $count = Document::whereYear('uploaded_at', $year)
            ->whereNotNull('document_number')
            ->count();

        $sequence = str_pad((string) ($count + 1), 3, '0', STR_PAD_LEFT);

        return "NEXTMUX-{$year}-{$sequence}";
    }
}