<?php

namespace App\Models;

use App\Enums\DocumentStatus;
use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'intern_id',
        'internship_id',
        'type',
        'status',
        'request_note',
        'rejection_reason',
        'file_path',
        'document_number',
        'requested_at',
        'reviewed_by',
        'reviewed_at',
        'generated_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => DocumentType::class,
            'status' => DocumentStatus::class,
            'requested_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'generated_at' => 'datetime',
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

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}