<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReportSubmittedNotification extends Notification implements ShouldQueue
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
        $url = config('app.frontend_url').'/reports/'.$this->report->id;

        return (new MailMessage)
            ->subject('Nouveau rapport déposé — '.$this->report->intern->name)
            ->greeting('Bonjour '.$notifiable->name.' !')
            ->line($this->report->intern->name.' a déposé un nouveau rapport.')
            ->line('Type : '.($this->report->type->value === 'weekly' ? 'Hebdomadaire' : 'Mensuel'))
            ->line('Période : '.$this->report->period_start->format('d/m/Y').' au '.$this->report->period_end->format('d/m/Y'))
            ->action('Voir le rapport', $url)
            ->line('Merci de le valider dès que possible.');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'report_submitted',
            'report_id' => $this->report->id,
            'intern_name' => $this->report->intern->name,
            'message' => $this->report->intern->name.' a déposé un nouveau rapport.',
        ];
    }
}