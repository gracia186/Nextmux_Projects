<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Str;

class ProjectIntern extends Pivot
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'project_intern';

    protected $fillable = [
        'id',
        'project_id',
        'intern_id',
        'assigned_at',
        'evaluation_score',
        'evaluation_comment',
        'evaluated_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $pivot): void {
            if (empty($pivot->id)) {
                $pivot->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
            'evaluation_score' => 'integer',
            'evaluated_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function intern(): BelongsTo
    {
        return $this->belongsTo(User::class, 'intern_id');
    }
}