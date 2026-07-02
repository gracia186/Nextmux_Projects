<?php

namespace App\Services;

use Carbon\Carbon;

class InternshipDurationService
{
    public function calculateWorkingDays(Carbon $startDate, Carbon $endDate): int
    {
        $days = 0;
        $current = $startDate->copy();

        while ($current->lessThanOrEqualTo($endDate)) {
            if (! $current->isWeekend()) {
                $days++;
            }

            $current->addDay();
        }

        return $days;
    }

    public function calculateCalendarDays(Carbon $startDate, Carbon $endDate): int
    {
        return $startDate->diffInDays($endDate) + 1;
    }

    public function isExpired(Carbon $endDate): bool
    {
        return $endDate->isPast();
    }
}