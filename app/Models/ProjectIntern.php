<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectIntern extends Pivot
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'project_intern';

    protected $fillable = [
        'project_id',
        'intern_id',
        'assigned_at',
        'evaluation_score',
        'evaluation_comment',
        'evaluated_at',
    ];

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