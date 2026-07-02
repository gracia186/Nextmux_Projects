<?php

namespace App\DTOs;

use App\Enums\ReportType;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;

final readonly class ReportData
{
    public function __construct(
        public string $internId,
        public string $internshipId,
        public ReportType $type,
        public Carbon $periodStart,
        public Carbon $periodEnd,
        public UploadedFile $file,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            internId: $data['intern_id'],
            internshipId: $data['internship_id'],
            type: ReportType::from($data['type']),
            periodStart: Carbon::parse($data['period_start']),
            periodEnd: Carbon::parse($data['period_end']),
            file: $data['file'],
        );
    }
}