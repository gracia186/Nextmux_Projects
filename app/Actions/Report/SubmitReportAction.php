<?php

namespace App\Actions\Report;

use App\DTOs\ReportData;
use App\Enums\ReportStatus;
use App\Models\Report;
use App\Notifications\ReportSubmittedNotification;
use App\Repositories\Contracts\ReportRepositoryInterface;
use App\Services\FileStorageService;
use Illuminate\Support\Str;

class SubmitReportAction
{
    public function __construct(
        private ReportRepositoryInterface $reports,
        private FileStorageService $fileStorage,
    ) {
    }

    public function execute(ReportData $data): Report
    {
        $path = $this->fileStorage->store(
            $data->file,
            "reports/{$data->internId}"
        );

        $report = $this->reports->create([
            'id' => (string) Str::uuid(),
            'intern_id' => $data->internId,
            'internship_id' => $data->internshipId,
            'type' => $data->type->value,
            'status' => ReportStatus::Pending->value,
            'period_start' => $data->periodStart,
            'period_end' => $data->periodEnd,
            'file_path' => $path,
            'file_name' => $data->file->getClientOriginalName(),
            'file_size' => $data->file->getSize(),
        ]);

        $report->loadMissing('internship.mentor');

        if ($report->internship->mentor) {
            $report->internship->mentor->notify(new ReportSubmittedNotification($report));
        }

        return $report;
    }
}