<?php

namespace App\Policies;

use App\Enums\ReportStatus;
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

    public function update(User $user, Report $report): bool
    {
        $status = $report->status instanceof ReportStatus
            ? $report->status->value
            : $report->status;

        return $user->id === $report->intern_id
            && $status !== ReportStatus::Validated->value;
    }

    public function delete(User $user, Report $report): bool
    {
        return $user->id === $report->intern_id;
    }

    public function download(User $user, Report $report): bool
    {
        return $this->view($user, $report);
    }
}