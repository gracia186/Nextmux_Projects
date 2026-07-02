<?php

namespace App\Actions\Report;

use App\DTOs\ValidateReportData;
use App\Enums\ReportStatus;
use App\Models\Report;
use App\Notifications\ReportValidatedNotification;
use App\Repositories\Contracts\ReportRepositoryInterface;

class ValidateReportAction
{
    public function __construct(
        private ReportRepositoryInterface $reports,
    ) {
    }

    public function execute(Report $report, ValidateReportData $data): Report
    {
        $updated = $this->reports->update($report, [
            'status' => $data->status->value,
            'mentor_comment' => $data->mentorComment,
            'validated_by' => $data->validatedBy,
            'validated_at' => now(),
        ]);

        $updated->loadMissing('intern');
        $updated->intern->notify(new ReportValidatedNotification($updated));

        return $updated;
    }
}