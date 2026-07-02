<?php

namespace App\Policies;

use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    public function submit(User $user): bool
    {
        return $user->isIntern();
    }

    public function view(User $user, Report $report): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->id === $report->intern_id) {
            return true;
        }

        return $user->isMentor() && $report->internship?->mentor_id === $user->id;
    }

    public function validate(User $user, Report $report): bool
    {
        $report->loadMissing('internship');

        return $user->isMentor() && $report->internship->mentor_id === $user->id;
    }

    public function download(User $user, Report $report): bool
    {
        return $this->view($user, $report);
    }
}