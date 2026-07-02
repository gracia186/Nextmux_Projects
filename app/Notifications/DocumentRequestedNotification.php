<?php

namespace App\Notifications;

use App\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentRequestedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Document $document,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = config('app.frontend_url').'/admin/documents/pending';
        $typeLabel = $this->document->type->value === 'attestation' ? 'attestation' : 'convention de stage';

        return (new MailMessage)
            ->subject('Nouvelle demande de document — '.$this->document->intern->name)
            ->greeting('Bonjour '.$notifiable->name.' !')
            ->line($this->document->intern->name.' a demandé une '.$typeLabel.'.')
            ->action('Traiter la demande', $url);
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'document_requested',
            'document_id' => $this->document->id,
            'intern_name' => $this->document->intern->name,
            'document_type' => $this->document->type->value,
            'message' => $this->document->intern->name.' a demandé une '.$this->document->type->value.'.',
        ];
    }
}