<?php

namespace App\Repositories;

use App\Models\InternshipFeedback;
use App\Repositories\Contracts\InternshipFeedbackRepositoryInterface;
use Illuminate\Support\Collection;

class InternshipFeedbackRepository implements InternshipFeedbackRepositoryInterface
{
    public function create(array $data): InternshipFeedback
    {
        return InternshipFeedback::create($data);
    }

    public function all(): Collection
    {
        return InternshipFeedback::with('intern')->orderBy('submitted_at', 'desc')->get();
    }
}