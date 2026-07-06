<?php

namespace App\Actions\Report;

use App\Models\Report;
use App\Repositories\Contracts\ReportRepositoryInterface;

class HideReportAction
{
    public function __construct(
        private ReportRepositoryInterface $reports,
    ) {
    }

    public function execute(Report $report): Report
    {
        return $this->reports->update($report, [
            'hidden_by_intern_at' => now(),
        ]);
    }
}