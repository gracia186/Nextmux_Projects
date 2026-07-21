<?php

namespace App\Console\Commands;

use App\Enums\AttendanceStatus;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class MarkAbsentInternsCommand extends Command
{
    protected $signature = 'attendance:mark-absent';

    protected $description = 'Marque absent tout stagiaire actif n\'ayant pas pointé la veille.';

    public function __construct(
        private InternshipRepositoryInterface $internships,
        private AttendanceRepositoryInterface $attendances,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $yesterday = Carbon::yesterday()->toDateString();
        $count = 0;

        foreach ($this->internships->allActive() as $internship) {
            if ($this->attendances->existsForDate($internship->intern_id, $yesterday)) {
                continue;
            }

            $this->attendances->create([
                'id' => (string) Str::uuid(),
                'intern_id' => $internship->intern_id,
                'internship_id' => $internship->id,
                'date' => $yesterday,
                'status' => AttendanceStatus::Absent->value,
                'absence_reason' => 'Absence non justifiée (aucun pointage enregistré).',
            ]);

            $count++;
        }

        $this->info("{$count} stagiaire(s) marqué(s) absent(s) pour le {$yesterday}.");

        return self::SUCCESS;
    }
}