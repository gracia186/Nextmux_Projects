<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $rawToken,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = config('app.frontend_url').'/invitation?token='.$this->rawToken;

        return (new MailMessage)
            ->subject('Bienvenue sur STAMUX — Activez votre compte')
            ->greeting('Bonjour '.$notifiable->name.' !')
            ->line('Un compte a été créé pour vous sur la plateforme STAMUX.')
            ->action('Activer mon compte', $url)
            ->line('Ce lien expire dans 72 heures.')
            ->line('Si vous n\'attendiez pas cet email, ignorez-le simplement.');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'invitation',
            'message' => 'Votre compte STAMUX a été créé. Cliquez pour l\'activer.',
        ];
    }
}