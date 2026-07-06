<?php

namespace App\Actions\Report;

use App\Models\Report;
use App\Repositories\Contracts\ReportRepositoryInterface;

class UpdateReportAction
{
    public function __construct(
        private ReportRepositoryInterface $reports,
    ) {
    }

    public function execute(Report $report, array $data): Report
    {
        return $this->reports->update($report, $data);
    }
}