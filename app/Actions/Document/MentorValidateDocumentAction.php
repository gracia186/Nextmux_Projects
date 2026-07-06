<?php

namespace App\Actions\Document;

use App\Enums\DocumentStatus;
use App\Enums\UserRole;
use App\Models\Document;
use App\Notifications\DocumentRequestedNotification;
use App\Repositories\Contracts\DocumentRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;

class MentorValidateDocumentAction
{
    public function __construct(
        private DocumentRepositoryInterface $documents,
        private UserRepositoryInterface $users,
    ) {
    }

    public function approve(Document $document, string $mentorId): Document
    {
        $updated = $this->documents->update($document, [
            'status' => DocumentStatus::MentorApproved->value,
            'mentor_id' => $mentorId,
            'mentor_validated_at' => now(),
        ]);

        $admins = $this->users->paginate(100, ['role' => UserRole::Admin->value]);

        foreach ($admins as $admin) {
            $admin->notify(new DocumentRequestedNotification($updated));
        }

        return $updated;
    }

    public function reject(Document $document, string $mentorId, string $reason): Document
    {
        return $this->documents->update($document, [
            'status' => DocumentStatus::MentorRejected->value,
            'mentor_id' => $mentorId,
            'mentor_validated_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }
}