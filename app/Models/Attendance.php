<?php

namespace App\Models;

use App\Enums\AttendanceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'intern_id',
        'internship_id',
        'date',
        'status',
        'note',
        'recorded_by',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'status' => AttendanceStatus::class,
        ];
    }

    public function intern(): BelongsTo
    {
        return $this->belongsTo(User::class, 'intern_id');
    }

    public function internship(): BelongsTo
    {
        return $this->belongsTo(Internship::class);
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}