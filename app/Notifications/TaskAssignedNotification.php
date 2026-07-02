<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Task $task,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = config('app.frontend_url').'/tasks/'.$this->task->id;

        return (new MailMessage)
            ->subject('Nouvelle tâche assignée — '.$this->task->title)
            ->greeting('Bonjour '.$notifiable->name.' !')
            ->line('Une nouvelle tâche vous a été assignée.')
            ->line('Tâche : '.$this->task->title)
            ->when($this->task->due_date, fn ($mail) => $mail
                ->line('Date limite : '.$this->task->due_date->format('d/m/Y'))
            )
            ->action('Voir la tâche', $url);
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'task_assigned',
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'message' => 'Une nouvelle tâche vous a été assignée : '.$this->task->title,
        ];
    }
}