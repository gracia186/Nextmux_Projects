<?php

namespace App\Notifications;

use App\Models\Report;
use App\Enums\ReportStatus;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReportValidatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Report $report,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $isValidated = $this->report->status === ReportStatus::Validated;
        $url = config('app.frontend_url').'/reports/'.$this->report->id;

        $mail = (new MailMessage)
            ->subject($isValidated ? 'Rapport validé' : 'Rapport rejeté')
            ->greeting('Bonjour '.$notifiable->name.' !');

        if ($isValidated) {
            $mail->line('Votre rapport a été validé par votre mentor.');
        } else {
            $mail->line('Votre rapport a été rejeté par votre mentor.');

            if ($this->report->mentor_comment) {
                $mail->line('Commentaire : '.$this->report->mentor_comment);
            }
        }

        return $mail->action('Voir le rapport', $url);
    }

    public function toDatabase(object $notifiable): array
    {
        $isValidated = $this->report->status === ReportStatus::Validated;

        return [
            'type' => 'report_validated',
            'report_id' => $this->report->id,
            'status' => $this->report->status->value,
            'message' => $isValidated
                ? 'Votre rapport a été validé.'
                : 'Votre rapport a été rejeté : '.$this->report->mentor_comment,
        ];
    }
}