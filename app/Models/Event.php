<?php

namespace App\Models;

use App\Enums\EventAudience;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'author_id',
        'title',
        'content',
        'audience',
        'is_pinned',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'audience' => EventAudience::class,
            'is_pinned' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}