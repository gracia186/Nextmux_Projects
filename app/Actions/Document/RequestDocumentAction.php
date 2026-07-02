<?php

namespace App\Actions\Document;

use App\DTOs\DocumentRequestData;
use App\Models\Document;
use App\Models\User;
use App\Notifications\DocumentRequestedNotification;
use App\Repositories\Contracts\DocumentRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Enums\UserRole;
use Illuminate\Support\Str;

class RequestDocumentAction
{
    public function __construct(
        private DocumentRepositoryInterface $documents,
        private UserRepositoryInterface $users,
    ) {
    }

    public function execute(DocumentRequestData $data): Document
    {
        $document = $this->documents->create([
            'id' => (string) Str::uuid(),
            'intern_id' => $data->internId,
            'internship_id' => $data->internshipId,
            'type' => $data->type->value,
            'request_note' => $data->requestNote,
            'requested_at' => now(),
        ]);

        $document->loadMissing('intern');

        $admins = $this->users->paginate(100, ['role' => UserRole::Admin->value]);

        foreach ($admins as $admin) {
            $admin->notify(new DocumentRequestedNotification($document));
        }

        return $document;
    }
}