<?php

namespace App\Actions\Report;

use App\Repositories\Contracts\ReportRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetReportHistoryAction
{
    public function __construct(
        private ReportRepositoryInterface $reports,
    ) {
    }

    public function execute(string $internId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->reports->paginateForIntern($internId, $perPage);
    }
}