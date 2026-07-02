<?php

namespace App\Notifications;

use App\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentReadyNotification extends Notification implements ShouldQueue
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
        $url = config('app.frontend_url').'/documents/'.$this->document->id.'/download';
        $typeLabel = $this->document->type->value === 'attestation' ? 'attestation' : 'convention de stage';

        return (new MailMessage)
            ->subject('Votre '.$typeLabel.' est prête')
            ->greeting('Bonjour '.$notifiable->name.' !')
            ->line('Votre '.$typeLabel.' a été générée et est disponible au téléchargement.')
            ->line('Numéro du document : '.$this->document->document_number)
            ->action('Télécharger le document', $url)
            ->line('Ce lien est valable 15 minutes.');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'document_ready',
            'document_id' => $this->document->id,
            'document_number' => $this->document->document_number,
            'document_type' => $this->document->type->value,
            'message' => 'Votre '.$this->document->type->value.' est prête au téléchargement.',
        ];
    }
}